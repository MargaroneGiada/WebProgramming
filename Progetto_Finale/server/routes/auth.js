const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose'); // Assicurati di importare mongoose

// Verifica se il modello User è già stato definito
const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
    email: String,
    username : String,
    hashedPassword: String,
    organizer: String
}));

  
// const User = mongoose.model('User', User);
  
async function checkUser(email, username) {
    try {
        const user = await User.findOne({ username: username});
        const em = await User.findOne({ email: email});

        if (user || em) {
            console.log('Utente o email già in uso');
            return user || em;
        } else {
            console.log('Nessun utente trovato con questi dati.');
            return null;
        }
    } catch (err) {
        console.error('Errore:', err);
        return null;
    }
}

async function logUser(email, password) {
    try {
        // Trova l'utente per email
        const user = await User.findOne({ email: email });

        if (!user) {
            console.log('Utente o password errati.');
            return null;
        }

        // Confronta la password
        const isMatch = await bcrypt.compare(password, user.hashedPassword);

        if (isMatch) {
            console.log('Utente e password corretti');
            return user;
        } else {
            console.log('Utente o password errati.');
            return null;
        }
    } catch (err) {
        console.error('Errore:', err);
        return null;
    }
}

// Route per la registrazione
router.post('/register', async (req, res) => {
    const { email, username, password, organizer } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const userExists = await checkUser(email, username);
        if (!userExists) {
            const newUser = new User({ email, username, hashedPassword, organizer });
            await newUser.save();
            res.status(201).json({ message: 'User registered successfully', user: newUser });
        } else {
            res.status(400).json({ message: 'Username o email già in uso!' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
});

router.post('/login', async (req, res) => {
    const { emailIn, passwordIn } = req.body;

    try {
        const user = await logUser(emailIn, passwordIn);
        if (user) {
            res.status(201).json({ message: 'User logged in successfully', user });
        } else {
            res.status(400).json({ message: 'Utente o password errati.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error logging user', error });
    }
});

// router.post('/user-info', async (req, res) => {
//     const { emailIn,  passwordIn} = req.body;

//     try {
//         const userExists = await logUser(emailIn, passwordIn);
//         if(userExists){
//             res.status(201).json({ message: 'User logged in successfully' });
//         }else {
//             res.status(400).json({ message: 'Username o email già in uso!' });
//         }
//     } catch (error) {
//         res.status(500).json({ message: 'Error logging user', error });
//     }
// });

module.exports = router;
