
class Users {

    constructor(){
        this.persons = []
    }

    addPerson (id, name, room) {
        let person = { id, name, room };
        this.persons.push(person);
        return this.persons; 
    }

    getPerson(id){
        let person = this.persons.filter(person => {
            return person.id === id 
        })[0];
        return person;
    }

    getPersons(){
        return this.persons;
    }

    getPersonsForHall(room){
        let personasEnSala = this.persons.filter( person => {
            return person.room === room 
        } );
        return personasEnSala;
    }

    deletePerson(id){
        let deletePerson = this.getPerson(id);
        this.persons = this.persons.filter( person => {
            return person.id != id
        });
        return deletePerson;
    }
}

module.exports = {
    Users
}