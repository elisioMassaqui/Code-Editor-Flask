# installer.py
import subprocess
import os
from time import sleep
from rich.console import Console
from rich.progress import Progress
from colorama import init

# Inicializar colorama e rich
init(autoreset=True)
console = Console()

def executar_comando(comando, mensagem_sucesso, mensagem_erro):
    try:
        console.print(f"[blue]Executando comando:[/blue] {comando}")
        processo = subprocess.Popen(comando, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        stdout, stderr = processo.communicate()

        if stdout:
            console.print(f"[green]{stdout}[/green]")
        if stderr:
            console.print(f"[red]{stderr}[/red]")
            console.print(f"[red]{mensagem_erro}[/red]")
        else:
            console.print(f"[green]{mensagem_sucesso}[/green]")

        if processo.returncode != 0:
            console.print(f"[red]Ocorreu um erro ao executar o comando:[/red] {comando}")

    except Exception as e:
        console.print(f"[red]Ocorreu uma exceção ao executar o comando:[/red] {e}")

def instalar_msi():
    caminho_documentos = os.path.expanduser(r"~\Documents\wandistudio\CLI")
    nome_arquivo = "arduino-cli_1.0.2_Windows_64bit.msi"
    caminho_msi = os.path.join(caminho_documentos, nome_arquivo)
    
    comando = f'msiexec /i "{caminho_msi}" /quiet /norestart'
    
    try:
        console.print("[blue]Preparando tudo pra você...[/blue]")

        # Exibir uma barra de progresso com rich
        with Progress() as progress:
            tarefa = progress.add_task("[blue]Progresso da Instalação[/blue]", total=100)
            for _ in range(10):
                sleep(0.3)  # Simulação de progresso
                progress.update(tarefa, advance=10)
        
        processo = subprocess.Popen(comando, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        stdout, stderr = processo.communicate()

        if stdout:
            console.print(f"[green]{stdout}[/green]")
        if stderr:
            console.print(f"[red]{stderr}[/red]")
        
        if processo.returncode == 0:
            console.print("[green]Instalação concluída com sucesso.[/green]")
            
            # Executar comandos adicionais com uma barra de progresso
            comandos_adicionais = [
                ('arduino-cli config init', 
                 "Configuração inicializada com sucesso.", 
                 "A configuração já existe."),
                ('arduino-cli core update-index',
                 "Índice de núcleos atualizado com sucesso.",
                 "Verifique sua conexão com a internet e tente novamente."),
                ('arduino-cli lib update-index',
                 "Índice de bibliotecas atualizado com sucesso.",
                 "Verifique sua conexão com a internet e tente novamente."),
                ('arduino-cli core install arduino:avr',
                 "Núcleo 'arduino:avr' instalado com sucesso.",
                 "Verifique sua conexão com a internet e tente novamente."),
                ('arduino-cli lib install "Servo"',
                 "Biblioteca 'Servo' instalada com sucesso.",
                 "Verifique sua conexão com a internet e tente novamente.")
            ]
            total_comandos = len(comandos_adicionais)
            with Progress() as progress:
                tarefa = progress.add_task("[green]Executando comandos adicionais[/green]", total=total_comandos)
                for i, (cmd, msg_sucesso, msg_erro) in enumerate(comandos_adicionais, start=1):
                    sleep(0.5)  # Simulação de progresso
                    executar_comando(cmd, msg_sucesso, msg_erro)
                    progress.update(tarefa, advance=1)
        else:
            console.print("[red]Ocorreu um erro durante a instalação.[/red]")
    
    except Exception as e:
        console.print(f"[red]Ocorreu uma exceção:[/red] {e}")
