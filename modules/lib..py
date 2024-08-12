import subprocess
import re


def get_libraries_from_arduino_cli():
    try:
        result = subprocess.run(
            ["arduino-cli", "lib", "search"], 
            stdout=subprocess.PIPE, 
            stderr=subprocess.PIPE, 
            text=True,
            encoding='utf-8'
        )

        output = result.stdout
        libraries = []
        pattern = re.compile(
            r'Name:\s*(.*?)\n\s*Author:\s*(.*?)\n.*?Category:\s*(.*?)\n.*?Versions:\s*\[(.*?)\]',
            re.DOTALL
        )

        matches = pattern.finditer(output)
        for match in matches:
            name = match.group(1).strip()
            author = match.group(2).strip()
            category = match.group(3).strip()
            versions = match.group(4).strip().split(',')
            last_version = versions[-1].strip() if versions else "N/A"

            libraries.append({
                'Name': name,
                'Author': author,
                'Category': category,
                'LastVersion': last_version
            })

        return libraries

    except Exception as e:
        print(f"Erro ao executar o comando arduino-cli: {e}")
        return []
