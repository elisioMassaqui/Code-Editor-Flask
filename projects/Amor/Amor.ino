// Declarações de variáveis e constantes
const int ledPin2 = 2; // O pino do LED embutido na placa Arduino
const int ledPin13 = 13; // O pino do LED embutido na placa Arduino
const int ledPin6 = 6; // O pino do LED embutido na placa Arduino

void setup() {
  // Configura o pino do LED como saída
  pinMode(ledPin13, OUTPUT);
  pinMode(ledPin2, OUTPUT);
  pinMode(ledPin6, OUTPUT);
}

void loop() {
  // Acende o LED
  digitalWrite(ledPin2, HIGH);
  delay(1000); // Aguarda 1 segundo

  // Apaga o LED
  digitalWrite(ledPin2, LOW);
  delay(1000); // Aguarda 1 segundo

  delay(5000);

  // Acende o LED
  digitalWrite(ledPin13, HIGH);
  delay(1000); // Aguarda 1 segundo

  // Apaga o LED
  digitalWrite(ledPin13, LOW);
  delay(1000); // Aguarda 1 segundo

  delay(5000);

    // Acende o LED
  digitalWrite(ledPin6, HIGH);
  delay(1000); // Aguarda 1 segundo

  // Apaga o LED
  digitalWrite(ledPin6, LOW);
  delay(1000); // Aguarda 1 segundo

  delay(5000);
}
