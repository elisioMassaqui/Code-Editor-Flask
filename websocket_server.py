import asyncio
import websockets
import os
from datetime import datetime
from rich.console import Console
from colorama import init

# Inicializar colorama e rich
init(autoreset=True)
console = Console()

clients = set()
base_log_path = os.path.expanduser('~/Documents/wandistudio/logs')

# Paths para os arquivos de log
log_paths = {
    'activity': os.path.join(base_log_path, 'log_activity.txt'),
    'errors': os.path.join(base_log_path, 'errors.log'),
    'connections': os.path.join(base_log_path, 'connections.log'),
    'messages': os.path.join(base_log_path, 'messages.log')
}

def ensure_logs_directory():
    os.makedirs(base_log_path, exist_ok=True)

def get_timestamp():
    return datetime.now().strftime('%Y-%m-%d %H:%M:%S')

async def log_activity(activity):
    ensure_logs_directory()
    timestamped_activity = f"{get_timestamp()} - {activity}\n"
    with open(log_paths['activity'], 'a') as log_file:
        log_file.write(timestamped_activity)
    console.print(f"[blue]{timestamped_activity.strip()}[/blue]")  # Imprime a atividade no console

async def log_error(error_message):
    ensure_logs_directory()
    timestamped_error = f"{get_timestamp()} - [red]Erro:[/red] {error_message}\n"
    with open(log_paths['errors'], 'a') as log_file:
        log_file.write(timestamped_error)
    console.print(f"[red]{timestamped_error.strip()}[/red]")

async def log_connection(connection_message):
    ensure_logs_directory()
    timestamped_connection = f"{get_timestamp()} - Conexão: {connection_message}\n"
    with open(log_paths['connections'], 'a') as log_file:
        log_file.write(timestamped_connection)
    console.print(f"[green]{timestamped_connection.strip()}[/green]")

async def log_message(message):
    ensure_logs_directory()
    timestamped_message = f"{get_timestamp()} - Mensagem: {message}\n"
    with open(log_paths['messages'], 'a') as log_file:
        log_file.write(timestamped_message)
    console.print(f"[cyan]{timestamped_message.strip()}[/cyan]")

async def ping_clients():
    while True:
        await asyncio.sleep(10)  # Intervalo entre pings
        disconnected_clients = []
        for client in clients:
            try:
                await client.ping()
            except websockets.ConnectionClosed:
                disconnected_clients.append(client)
        
        for client in disconnected_clients:
            clients.remove(client)
            notification = "Um cliente foi desconectado devido à inatividade."
            await asyncio.gather(*[c.send(notification) for c in clients])
            await log_activity(notification)
            await log_error("Cliente desconectado devido à inatividade.")

async def handle_client(websocket, path):
    clients.add(websocket)

    # Notifica sobre a nova conexão (sem tags de formatação)
    notification = "Editor e Ambiente 3D Conectados com sucesso."
    await asyncio.gather(*[client.send(notification) for client in clients if client != websocket])
    await log_connection(notification)  # Log no terminal com cor

    try:
        async for message in websocket:
            console.print(f"[magenta]Recebido:[/magenta] {message}")
            # Envia a mensagem para todos os outros clientes, exceto o remetente
            tasks = [client.send(message) for client in clients if client != websocket]
            await asyncio.gather(*tasks)
            await log_message(message)
    except websockets.ConnectionClosed:
        console.print("[yellow]Cliente desconectado[/yellow]")
    finally:
        clients.remove(websocket)

        # Notifica sobre a desconexão (sem tags de formatação)
        notification = "Um cliente saiu do chat."
        await asyncio.gather(*[client.send(notification) for client in clients])
        await log_connection(notification)  # Log no terminal com cor

async def start_server():
    asyncio.create_task(ping_clients())  # Inicia o ping em segundo plano
    async with websockets.serve(handle_client, "localhost", 8765):
        console.print("[bold blue]Mensageiro: Servidor WebSocket 8765 Iniciado...[/bold blue]")
        await asyncio.Future()
