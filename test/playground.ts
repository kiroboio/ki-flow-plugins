class Person {
  public driver: boolean = false;
  constructor(public name: string) {}

  setDriver() {
    this.driver = true;
  }
}

class Bus {
  public passengers: Person[] = [];
  public passangersByName: Record<string, Person> = {};
  constructor(passengers: Person[]) {
    this.passengers = passengers;
    this.passangersByName = passengers.reduce((acc, passenger) => {
      acc[passenger.name] = passenger;
      return acc;
    }, {} as Record<string, Person>);
  }
}

function main() {
  const person = new Person("John");
  const bus = new Bus([person]);

  console.log(bus);

  person.setDriver();

  console.log("Bus after calling person", bus);
}

main();
