// Código em C para Arduino: Explore a programação no Arduino de maneira divertida e educativa com a Causa-Efeito, SINER.

void setup() {
      // Inicializa a comunicação serial
      Serial.begin(9600);
  }
  
  void loop() {
      // Imprime uma mensagem especial pela porta serial
      Serial.println("Hello, Unity!");
      
      // Aguarda um momento antes da próxima aventura
      delay(1000);
  }