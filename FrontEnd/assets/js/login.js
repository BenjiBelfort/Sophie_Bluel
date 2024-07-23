const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', function(event){
    event.preventDefault();
    const user = {
        email: document.querySelector('#email').value,
        password: document.querySelector('#password').value,
    };
    console.log(user);

    fetch("http://localhost:5678/api/users/login", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(user),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Adresse mail et/ou mot de passe incorrects !");
        }
        return response.json();
    })

    .then(user => {
        console.log(user);
        sessionStorage.setItem('token', user.token); // clé crée et stockée dans le sessionStorage
        window.location.href = 'index.html';
    })
    // permet de créer le message d'erreur dans la console et HTML
    .catch(error => {
        console.log(error);
        alert("Erreur de saisie ! Votre identifiant et/ou mot de passe sont incorrects");
    });
    console.log(sessionStorage.getItem('token'));
});