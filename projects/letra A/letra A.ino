unsigned long previousMillis = 0; // Armazena o tempo da última mensagem
const long interval = 500; // Intervalo de 500 milissegundos (meio segundo)

void setup() {
  Serial.begin(9600); // Inicia a comunicação serial a 9600 bps
}

void loop() {
  unsigned long currentMillis = millis(); // Obtém o tempo atual

  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis; // Atualiza o tempo da última mensagem
    
    if (Serial.available() > 0) {
      char receivedChar = Serial.read(); // Lê o caractere recebido
      
      if (receivedChar == 'A') {
        Serial.println("Ah, claro, você digitou 'A'. O que mais você tem de surpreendente para me mostrar?");
      }
    }
  }
}
