const { Users } = require('../class/Users');
const { io } = require('../server');
const { crearMensaje } = require('../utils/utils');

const usuarios = new Users();

io.on('connect', (client) => {

    client.on('entrarChat', (data, callback) => {
       
        console.log(data)
        if(!data.nombre || !data.sala ){
            return callback({
                error: true,
                msg: 'El nombre/sala es necesario'
            });
        }
        client.join(data.sala);
        usuarios.addPerson(client.id, data.nombre, data.sala);
        client.broadcast.to(data.sala).emit('listaPersona', usuarios.getPersonsForHall(data.sala));
        client.broadcast.to(data.sala).emit('crearMensaje', crearMensaje('Admin', `${data.nombre} ingreso al chat `))
        
        callback(usuarios.getPersonsForHall(data.sala));

    });

    client.on('crearMensaje', (data, callback) => {
        let persona = usuarios.getPerson(client.id);
        let mensaje = crearMensaje( persona.name, data.mensaje );
        client.broadcast.to(persona.room).emit('crearMensaje', mensaje);
        callback(mensaje);
    })

    client.on('disconnect', () => {
        let personDeleted = usuarios.deletePerson(client.id);
        client.broadcast.to(personDeleted.room).emit('crearMensaje', crearMensaje('Admin', `${personDeleted.name} abandono el chat `))
        client.broadcast.to(personDeleted.room).emit('listaPersona', usuarios.getPersonsForHall(personDeleted.sala));
    });

    // Mensajes privados
    client.on('mensajePrivado', data => {
        let persona = usuarios.getPerson( client.id );
        client.broadcast.to(data.para).emit( 'mensajePrivado', crearMensaje(persona.name, data.mensaje ) );
    })
});