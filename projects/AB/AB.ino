// C�digo em C para Arduino: Explore a programa��o no Arduino de maneira divertida e educativa com a Causa-Efeito, SINER.

void setup() {
      // Inicializa a comunica��o serial
      Serial.begin(9600);
  }
  
  void loop() {
      // Imprime uma mensagem especial pela porta serial
      Serial.println("Hello, Unity!");
      
      // Aguarda um momento antes da pr�xima aventura
      delay(1000);

      Serial.println("Another Message");
      delay(2000);

      Serial.println("Message 3");
      
      delay(3000);
  }