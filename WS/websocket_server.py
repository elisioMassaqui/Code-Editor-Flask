# websocket_server.py
import asyncio
import websockets

clients = set()

async def log_activity(activity):
    print(activity)  # Imprime a atividade no console

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

async def handle_client(websocket, path):
    clients.add(websocket)

    # Notifica sobre a nova conexão
    notification = "Um novo cliente entrou no chat."
    await asyncio.gather(*[client.send(notification) for client in clients if client != websocket])
    await log_activity(notification)

    try:
        async for message in websocket:
            print(f"Recebido: {message}")
            # Envia a mensagem para todos os outros clientes, exceto o remetente
            tasks = [client.send(message) for client in clients if client != websocket]
            await asyncio.gather(*tasks)
            await log_activity(f"Mensagem: {message}")
    except websockets.ConnectionClosed:
        print("Cliente desconectado")
    finally:
        clients.remove(websocket)

        # Notifica sobre a desconexão
        notification = "Um cliente saiu do chat."
        await asyncio.gather(*[client.send(notification) for client in clients])
        await log_activity(notification)

async def start_server():
    asyncio.create_task(ping_clients())  # Inicia o ping em segundo plano
    async with websockets.serve(handle_client, "localhost", 8765):
        print("Mensageiro: Servidor WebSocket 8765 Iniciado...")
        await asyncio.Future()
