# Car Sales API! 🚗

Welcome to Car Sales API! A fully hand-made API using express, deno and MongoDB.

## Endpoints 🌐

### GET

`"/api/getDealerCars/:nif"`

This function return the dealership cars. As a result, this function maps all
the id's into a Car object, displaying each car detailed info given specified
NIF.

`"/api/getClientCars/:dni"`

This function return the client cars. As a result, this function maps all the
id's into a Car object, displaying each car detailed info given specified DNI.

### DELETE

`"/api/deleteDealerCar/:nif"`

This function deletes an object (car) in dealership's storage (cars). NIF is
passed as an argument here, while the plate (car) to delete is passed as the
body of the request. It'll only be successful if dealer owns the car.

`"/api/deleteClientCar/:dni"`

This function deletes an object (car) in client storage (cars). DNI is passed as
an argument here, while the plate (car) to delete is passed as the body of the
request. It'll only be successful if the client owns the car.

### POST

`"/api/addCar"`

This function adds a car into the Car database. The car to be created (all
arguments) is passed through the body of the request. It will be successfully
added if there is not already a car with the same plate.

`"/api/addDealer"`

This function adds a dealership into the Dealer database. The dealer to be
created (all arguments) is passed through the body of the request. It will be
successfully added if there is not already a dealer with the same NIF.

`"/api/addClient"`

This function adds a client into the Clients database. The client to be created
(all arguments) is passed through the body of the request. It will be
successfully added if there is not already a client with the same DNI.

### PUT

`"/api/addCarDealer/:nif"` This method allows the user to add a car into a
particular dealership. The dealership's NIF is passed as an argument. The car
and its arguments passed in the body will be storaged in the Car database as
well. If the dealership already has 10 cars, it wont be added into the car list,
or if the new plate already exists, the program will throw an error.

`"/api/sellCar/:nif"`

This function allows a dealership to sell a car to a particular client, always
if 'canSell' is set to 'true'. Data like 'dniClient' and 'plate' (car to buy)
must be in the body of the request.

`"/api/tradeCar/:dni"`

This function allows to exchange a car between two clients, only if buyer has
enough money to buy it and only if seller owns the car. The remaining data, like
'dniSeller', 'dniBuyer' or 'plate' must be included in the body. This method can
encounter different exceptions, such as if buyer does not have enough fund, the
car is missing, etc.

`"/api/addMoneyClient/:dni"`

This function allows a user to add certain amount of money into a specified
client (DNI). If a user does not have enough funds to buy a car, this function
will fix that issue. The amount is passed as body in the request.

`"/api/changeSellStatus/:nif"`

Given NIF, this function changes the dealer 'canSell' value, which allow/deny to
perform a transaction. If this flag is 'true', it'll be changed to 'false' and
viceversa.

## Types 🧬

Client

```
export type Client = {
    name: string,
    dni: string,
    bank: number,
    cars: string[],
};
```

Client Schema:

- Name: contains the name of the client. _Required: yes._
- DNI: contains an **unique** identifier attached to a client. _Required: yes._
- Bank: contains the amount of money the client has to buy a car, either do a
  transaction. _Required: yes._
- Cars: contains a list with the **id (mongo)** of the cars a client owns.
  _Required: yes_.

Dealer

```
export type Dealer = {
    name: string,
    nif: number
    location: string,
    zip: string,
    cars: string[],
    bank: number,
    canSell: boolean,
};
```

Dealer Schema:

- Name: contains the name of the dealer. _Required: yes._
- NIF: contains an **unique** identifier attached to a dealer. _Required: yes._
- Location: contains the dealership location. _Required: yes._
- ZIP: contains the postal code associated whereas its located. _Required: yes._
- Cars: contains a list with the **id (mongo)** of the cars a dealership owns.
  _Required: yes_.
- Bank: contains the amount of money the client has to buy a car, either do a
  transaction. _Required: yes._
- canSell: a **boolean** flag that can deny the sale to a dealer. By default,
  this value is always 'true'. _Required: yes._

Car

```
export type Car = {
    model: string,
    seats: number,
    plate: string,
    price: number,
    description?: string,
};
```

Car Schema:

- Model: contains the model type of the car. _Required: yes._
- Seats: contains the number of seats. _Required: yes._
- Plate: contains a **unique** identifier attached to a singular object.
  _Required: yes._
- Price: contains the retail price. _Required: yes_.
- Description: can contain a brief description of the model selected. _Required:
  optional._

## What do I need to run? 🔄

To deploy this project in your local environment, this are the steps in order to
execute it:

- `$ git clone https://github.com/guillermoar26/Practica4-Sistemas-Internet-23-24-Guillermo.git`
- Open the project in your preferred code editor, such as Visual Studio Code.

_You may need to install deno in your computer, check references
[here](https://docs.deno.com/runtime/manual/getting_started/installation)_

- add your own **.env** values!!! In this commit there is a **env.sample**, feel
  free to use it with your own sensitive data! (Otherwise it won't work...)

- In your cli, add this command `$ deno task dev` (Oops! Make sure you do it in
  the right directory)

Congratulations! If you came so far, you will see this message on console:
`Server ready on http://localhost:8080/`

# 

or... of course you can use **Deno Deploy** to avoid deploying the project
locally and go straight-forward to Postman! _Remember, browsers only processes
GET methods, so if you want to use the remaining methods, use Postman or
whatever you get comfortable with!_

Congratulations! If you came so far, you will see this message on console:
`Server ready on http://localhost:8080/`

# 

or... of course you can use **Deno Deploy** to avoid deploying the project
locally and go straight-forward to Postman! _Remember, browsers only processes
GET methods, so in order to try the rest, you must use Postman or whatever you
get coomfortable with!_
