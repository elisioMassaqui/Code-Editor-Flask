import subprocess

def run_command(command):
    """
    Executa um comando no sistema operacional sem abrir uma janela de terminal.

    Args:
        command (list): Lista de strings representando o comando e seus argumentos.

    Returns:
        str: Saída padrão do comando se for bem-sucedido, ou mensagem de erro se não for.
    """
    try:
        # Executa o comando e evita a abertura de uma janela de terminal
        result = subprocess.run(command, capture_output=True, text=True, creationflags=subprocess.CREATE_NO_WINDOW)
        if result.returncode == 0:
            return result.stdout  # Retorna a saída padrão se o comando for bem-sucedido
        else:
            return result.stderr  # Retorna a saída de erro se o comando falhar
    except FileNotFoundError:
        return "Comando não encontrado."  # Mensagem de erro se o comando não for encontrado
    except Exception as e:
        return f"Erro ao executar o comando: {e}"  # Mensagem de erro para exceções inesperadas
