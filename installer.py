import subprocess
import os
from time import sleep
from colorama import init, Fore

# Inicializar colorama
init(autoreset=True)

def executar_comando(comando, mensagem_sucesso, mensagem_erro):
    """Executa um comando e exibe mensagens de sucesso ou erro."""
    try:
        print(f"{Fore.GREEN}Executando comando: {comando}")
        processo = subprocess.Popen(comando, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        stdout, stderr = processo.communicate()

        if stdout:
            print(f"{Fore.GREEN}{stdout}")
        if stderr:
            print(f"{Fore.CYAN}{stderr}")
            print(f"{Fore.CYAN}{mensagem_erro}")
        else:
            print(f"{Fore.GREEN}{mensagem_sucesso}")

        if processo.returncode != 0:
            print(f"{Fore.CYAN}Ocorreu um erro ao executar o comando: {comando}")

    except Exception as e:
        print(f"{Fore.CYAN}Ocorreu uma exceção ao executar o comando: {e}")

def instalar_msi():
    """Instala o MSI e executa comandos adicionais."""
    caminho_documentos = os.path.expanduser(r"~\Documents\wandistudio\CLI")
    nome_arquivo = "arduino-cli_1.0.2_Windows_64bit.msi"
    caminho_msi = os.path.join(caminho_documentos, nome_arquivo)
    
    comando = f'msiexec /i "{caminho_msi}" /quiet /norestart'
    
    try:
        print(f"{Fore.GREEN}Preparando tudo pra você...")

        # Simulação de progresso
        for _ in range(10):
            sleep(0.3)
        
        processo = subprocess.Popen(comando, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        stdout, stderr = processo.communicate()

        if stdout:
            print(f"{Fore.GREEN}{stdout}")
        if stderr:
            print(f"{Fore.CYAN}{stderr}")
        
        if processo.returncode == 0:
            print(f"{Fore.GREEN}Instalação concluída com sucesso.")
            
            # Executar comandos adicionais
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
            
            for cmd, msg_sucesso, msg_erro in comandos_adicionais:
                sleep(0.5)  # Simulação de progresso
                executar_comando(cmd, msg_sucesso, msg_erro)
        else:
            print(f"{Fore.CYAN}Ocorreu um erro durante a instalação.")
    
    except Exception as e:
        print(f"{Fore.CYAN}Ocorreu uma exceção: {e}")
