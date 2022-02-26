const User = require('../../models/user')
const Event = require('../../models/event'); 
const bcrypt = require('bcryptjs/dist/bcrypt');
const Booking = require('../../models/booking')

const transformEvent = event => {
    return {
        ...event._doc,
        _id:event.id,
        date:new Date(event._doc.date).toISOString(),
        creator:user.bind(this,event.creator)
    }
  }

const events = async eventIds => {
    const events = await Event.find({_id:{$in:eventIds}})
    try{
        return events.map(event => {
            return transformEvent(event)
        })
    }
    catch (err){
        throw err
        }
    }

    const singleEvent = async eventId => {
        try {
          const event = await Event.findById(eventId);
          return transformEvent(event)
        } catch (err) {
          throw err;
        }
      };
      
       
  
  const user = async userId => {
      try{
        const user = await User.findById(userId)
        return {
          ...user._doc,
          _id:user.id,
          createdEvents:events.bind(this,user._doc.createdEvents)
        }
      }
      catch(err){
          throw err
      }
  }


module.exports = 
{   events: async() => {
    try{
        const events = await  Event.find()
        return events.map(event => {
          return transformEvent(event)
      })
    } catch(err){
        throw err
        }
    },
    bookings: async () => {
        try {
          const bookings = await Booking.find();
          return bookings.map(booking => {
            return {
              ...booking._doc,
              _id: booking.id,
              user: user.bind(this, booking._doc.user),
              event: singleEvent.bind(this, booking._doc.event),
              createdAt: new Date(booking._doc.createdAt).toISOString(),
              updatedAt: new Date(booking._doc.updatedAt).toISOString()
            };
          });
        } catch (err) {
          throw err;
        }
      },
    createEvent: async args => {
     
      const event = new Event({
        title:args.eventInput.title,
        description:args.eventInput.description,
        street:args.eventInput.street,
        city:args.eventInput.city,
        date:new Date(args.eventInput.date),
        postal_code:args.eventInput.postal_code,
        price:args.eventInput.price,
        email:args.eventInput.email,
        username:args.eventInput.username,
        creator:'621a85cc659fda71419baf47'
      })
      let createdEvent;
      try{
        const result = await event
        .save()
        
          createdEvent =  transformEvent(result)
          const creator = await User.findById('621a94392d420b61db7d3461')
          creator.createdEvents.push(event);
          await creator.save();
       
          if(!creator){
            throw new Error("user not found")
          }
         
          return createdEvent
      }catch(err){
          console.log(err);
          throw err
      }
    },
    createUser: async args => {
        try{
            const existingUser = await User.findOne({email:args.userInput.email})
      
            if(existingUser){
              throw new Error("User exists already.")
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password,12)
          
          
            const user = new User ({
              username: args.userInput.username,
              firstname: args.userInput.firstname,
              lastname: args.userInput.lastname,
              email: args.userInput.email,
              password: hashedPassword,
            })
            const result = await user.save();
          
            return {...result._doc,password:null,_id:result.id}
        }catch(err){
            throw err
        }

    },
    bookEvent: async args => {
        const fetchedEvent = await Event.findOne({ _id: args.eventId });
        const booking = new Booking({
          user: '5c0fbd06c816781c518e4f3e',
          event: fetchedEvent
        });
        const result = await booking.save();
        return {
          ...result._doc,
          _id: result.id,
          user: user.bind(this, booking._doc.user),
          event: singleEvent.bind(this, booking._doc.event),
          createdAt: new Date(result._doc.createdAt).toISOString(),
          updatedAt: new Date(result._doc.updatedAt).toISOString()
        };
      },
      cancelBooking: async args => {
        try {
          const booking = await Booking.findById(args.bookingId).populate('event');
          const event = transformEvent(booking.event)
          await Booking.deleteOne({ _id: args.bookingId });
          return event;
        } catch (err) {
          throw err;
        }
      }
  }