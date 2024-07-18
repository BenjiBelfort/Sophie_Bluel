async function filtres() {
    let token = sessionStorage.getItem('token');
    let mesCategories = await fetch("http://localhost:5678/api/categories");
    let maReponse = await mesCategories.json();
    console.log(maReponse);

    let filter_buttons = document.querySelector(".filter_buttons");

    function filtrerImages(categorie) {
        let images = document.querySelectorAll(".work-item");
        images.forEach(image => {
            if (categorie === "Tous" || image.dataset.categorie === categorie) {
                image.style.display = "block";
            } else {
                image.style.display = "none";
            }
        });
    }

    // Initialise le contenu HTML avec le bouton "Tous"
    let htmlContent = '<button class="filtres active" data-categorie="Tous">Tous</button>';

    // Ajoute un bouton pour chaque catégorie
    maReponse.forEach(i => {
        htmlContent += `<button class="filtres" data-categorie="${i.name}">${i.name}</button>`;
    });
 
    // Insère les boutons dans l'élément filter_buttons, sauf si l'utilisateur est connecté
    if (!token) {
        filter_buttons.innerHTML = htmlContent;
    }

    // Ajoute les gestionnaires d'événements pour chaque bouton
    document.querySelectorAll(".filtres").forEach(bouton => {
        bouton.addEventListener("click", () => {
            // Retire la classe active de tous les boutons
            document.querySelectorAll(".filtres").forEach(btn => {
                btn.classList.remove('active');
                btn.classList.remove('active-intermediate');
            });

            // Ajoute la classe active au bouton cliqué
            bouton.classList.add('active');

            // Met à jour le bouton actif
            activeButton = bouton;

            // Filtre les images en fonction de la catégorie
            filtrerImages(bouton.dataset.categorie);
        });

        bouton.addEventListener("mouseover", () => {
            if (activeButton && activeButton !== bouton) {
                activeButton.classList.remove('active');
                activeButton.classList.add('active-intermediate');
            }
        });

        bouton.addEventListener("mouseout", () => {
            if (activeButton && activeButton !== bouton) {
                activeButton.classList.remove('active-intermediate');
                activeButton.classList.add('active');
            }
        });
    });

    // Définir le bouton "Tous" comme actif par défaut
    activeButton = document.querySelector('.filtres.active');

    // Filtrer les images par défaut avec la catégorie "Tous"
    filtrerImages("Tous");
}

// Appel de la fonction filtres pour initialiser les boutons et les filtres
filtres();

// fonction ajout projet depuis modale
function chargementCategoriesProjets() {
    fetch("http://localhost:5678/api/categories")
    .then(response => response.json())

    .then(data => {
        const select = document.getElementById("category");
        select.innerHTML = "";
        
        data.forEach(category => {
            const option = document.createElement("option");
            option.value = category.id;
            option.textContent = category.name;
            select.appendChild(option);
        });
    })

    .catch(error => {
        console.log("Erreur lors du chargement des catégories :", error);
    });
}


// fonction qui permet d'ajouter les photos dans la galerie
async function works() {
    try {
        let mesTravaux = await fetch("http://localhost:5678/api/works");
        if (!mesTravaux.ok) {
            throw new Error('Erreur lors du chargement des travaux');
        }
        let maReponse = await mesTravaux.json();
        console.log(maReponse);

        let gallery = document.querySelector(".gallery");
        gallery.innerHTML = ""; // Nettoie la galerie existante

        maReponse.forEach(i => {
            const figure = document.createElement("figure");
            figure.className = 'work-item';
            figure.dataset.categorie = i.category.name; // Ajoute la catégorie de l'image
            figure.style.display = "block"; // Assure que chaque image est visible par défaut

            const images = document.createElement("img");
            images.className = 'imagesWorks';
            images.setAttribute("src", i.imageUrl);
            images.setAttribute("alt", i.title);

            const figcaption = document.createElement("figcaption");
            figcaption.innerText = i.title;

            // Ajoute l'image et le titre au <figure>
            figure.appendChild(images);
            figure.appendChild(figcaption);

            // Ajoute le <figure> à la galerie
            gallery.appendChild(figure);
        });
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors du chargement des travaux. Veuillez réessayer.');
    }
}
works();

async function worksModal () {
    let mesTravaux = await fetch("http://localhost:5678/api/works");
    let maReponse = await mesTravaux.json();
    let gallery = document.querySelector(".modal__gallery");
    gallery.innerHTML = ''; // Réinitialisez le contenu de la galerie

    maReponse.forEach(i => {
        const figure = document.createElement("figure");
        figure.className = 'modal-work-item';
        figure.dataset.categorie = i.category.name;
        figure.dataset.id = i.id; // Ajoutez l'ID de l'élément
        figure.style.display = "block";

        const images = document.createElement("img");
        images.className ='imagesWorks';
        images.setAttribute("src",i.imageUrl);
        images.setAttribute("alt",i.title);

        // ajout trash en haut de l'image
        const closeButton = document.createElement("button");
        closeButton.className = 'trash-icon';
        
        // Créer l'élément icône trash
        const icon = document.createElement("i");
        icon.className = "fa-solid fa-trash-can";
        closeButton.appendChild(icon);

        //closeButton.onclick = () => {
        //    gallery.removeChild(figure); // Supprime l'image et la figure
        //};


        figure.appendChild(images);
        figure.appendChild(closeButton);

        gallery.appendChild(figure);
    });
    attachTrashIconEventListeners();

}

// script qui vérifie si l'utilisateur est connecté en vérifiant la présence du token dans le sessionStorage
document.addEventListener('DOMContentLoaded', function() {
    const token = sessionStorage.getItem('token');
    if (token) {
        // Affiche la div .edition_mode
        const editionModeDiv = document.querySelector('.edition_mode');
        if (editionModeDiv) {
            editionModeDiv.style.display = 'flex';
        }

        // Affiche le bouton modifier à coté du h2 "Mes Projets"
        const modalButton = document.getElementById('modal-button');
        if (modalButton) {
            modalButton.style.display = 'flex';
        }

        // Transformer "login" en "logout"
        const navLogin = document.getElementById('navLogin');
        if (navLogin) {
            navLogin.textContent = 'logout';
            navLogin.style.fontWeight = 'bold'; // Appliquer le style en gras
            navLogin.href = '#'; // Prevent default navigation

            // Ajouter un événement de déconnexion
            navLogin.addEventListener('click', function(event) {
                event.preventDefault();
                sessionStorage.removeItem('token'); // Supprimer le token
                window.location.href = 'index.html'; // Recharger la page d'accueil
            });
        }

        worksModal();
    }
});



// Fonctions pour ouvrir et fermer la modale
// Récupérer les éléments
const overlay = document.getElementById('overlay');
const modal = document.getElementById('modal');
const modal1 = document.getElementById('modal1');
const modal2 = document.getElementById('modal2');
const modalButton = document.getElementById('modal-button');
const modalClose = document.getElementById('modalClose');
const modalClose2 = document.getElementById('modalClose2');
const addButton1 = document.getElementById('addButton1');
let boutonValider = document.getElementById('valider');
const backButton = document.getElementById('backButton')


// Fonction pour ouvrir la modale
function openModal() {
    overlay.style.display = 'block';
    modal.style.display = 'flex';
    modal1.style.display = 'block';
    backButton.style.display = 'none';
    worksModal();
}

// Fonction pour fermer la modale
function closeModal() {
    overlay.style.display = 'none';
    modal.style.display = 'none';
    modal1.style.display = 'none';
}

// Fonction pour passer à la modale suivante
function nextModal() {
    const form = document.querySelector('.modal__form');
    form.reset(); // Réinitialiser le formulaire
    resetFormPreview(); // Réinitialiser l'aperçu de l'image

    // Appel de checkFormValidity pour s'assurer que le bouton est dans le bon état
    checkFormValidity();

    modal1.style.display = 'none';
    modal2.style.display = 'flex';
    backButton.style.display = 'block';

    chargementCategoriesProjets();
}

// Attacher les gestionnaires d'événements
modalButton.addEventListener('click', openModal);
modalClose.addEventListener('click', closeModal);
modalClose2.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);
addButton1.addEventListener('click', nextModal);
backButton.addEventListener('click', openModal);


// supprimer des projets de la BDD
function attachTrashIconEventListeners() {
    const trashIcons = document.querySelectorAll('.trash-icon');
    
    trashIcons.forEach(icon => {
        icon.addEventListener('click', (event) => {
            event.preventDefault();
            console.log('Trash icon clicked');
            showConfirmationModal(event.target.closest('figure'));
        });
    });
}

  

//fonction de confirmation de suppression du projet
function showConfirmationModal(item) {
    const modalSuppr = document.createElement('div');
    modalSuppr.classList.add('modalSuppr');
  
    modalSuppr.innerHTML = `
      <div class="modal-content">
        <i class="fa-solid fa-triangle-exclamation"></i>
        <p>Êtes-vous sûr de vouloir supprimer cet élément ?</p>
        <button id="confirmDelete">Oui</button>
        <button id="cancelDelete">Non</button>
        <p>Cette action est définitve !</p>
      </div>
    `;
  
    document.body.appendChild(modalSuppr);
    modalSuppr.style.display = 'block';
  
// Gérer les clics sur les boutons de confirmation et d'annulation
    document.getElementById('confirmDelete').addEventListener('click', () => {
      deleteItem(item);
      document.body.removeChild(modalSuppr);
    });
  
    document.getElementById('cancelDelete').addEventListener('click', () => {
      document.body.removeChild(modalSuppr);
    });
  }

// fonction de suppression de la BDD
function deleteItem(item) {
    const itemId = item.getAttribute('data-id'); // Assurez-vous que chaque figure a un attribut data-id
    console.log(`Attempting to delete item with id: ${itemId}`);

    const token = sessionStorage.getItem('token'); // Récupérer le jeton depuis sessionStorage

    if (!token) {
        console.error('Jeté de token non défini');
        return;
    }

    fetch(`http://localhost:5678/api/works/${itemId}`, {
        method: 'DELETE',
        headers: {
            'accept': '*/*',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Ajoutez le jeton d'authentification
        }
    })
    .then(response => {
        console.log('Response status:', response.status);
        if (!response.ok) {
            return response.json().then(error => {
                throw new Error(`Erreur lors de la suppression: ${error.message}`);
            });
        }

        // Vérifiez si la réponse est vide (204 No Content)
        if (response.status === 204) {
            return { success: true }; // Retourner un objet indiquant que la suppression a réussi
        } else {
            return response.json(); // Sinon, lire la réponse JSON normalement
        }
    })
    .then(data => {
        console.log('Response data:', data);
        if (data.success) {
            item.remove();
            works();
        } else {
            alert('Erreur lors de la suppression');
        }
    })
    .catch(error => {
        console.error('Erreur:', error);
        alert(`Erreur lors de la suppression: ${error.message}`);
    });
}



// Fonction pour vérifier si le formulaire est valide
function checkFormValidity() {
    const valeurInputTitre = document.getElementById("titre");
    const valeurInputImage = document.getElementById("photo");
    const valeurInputCatgory = document.getElementById("category");
    const addButton = document.querySelector('.modal__footer__button2');

    // Vérifier la validité des champs individuellement
    const isTitleValid = valeurInputTitre.value.trim() !== '';
    const isImageValid = valeurInputImage.files.length > 0;
    const isCategoryValid = valeurInputCatgory.value.trim() !== '';

    // Activer ou désactiver le bouton en fonction de la validité des champs
    addButton.disabled = !(isTitleValid && isImageValid && isCategoryValid);
}

// Fonction pour réinitialiser le formulaire et l'aperçu de l'image
function resetFormPreview() {
    const formPreview = document.getElementById('photo-form');
    if (formPreview) {
        formPreview.reset();
    }
    
    const preview = document.getElementById('photo-preview');
    preview.style.display = 'none';
    preview.src = '';
    
    const removeButton = document.getElementById('remove-photo');
    removeButton.style.display = 'none';
    
    document.querySelector('.ajout-photo i').style.display = 'block';
    document.querySelector('.ajout-photo .file-label').style.display = 'block';
    document.querySelector('.ajout-photo p').style.display = 'block';

    // Vérifier l'état des champs après la réinitialisation
    checkFormValidity();
}

// Aperçu de l'image dans la modale
document.getElementById('photo').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('photo-preview');
            preview.src = e.target.result;
            preview.style.display = 'block';
            
            document.getElementById('remove-photo').style.display = 'block';
            
            document.querySelector('.ajout-photo i').style.display = 'none';
            document.querySelector('.ajout-photo .file-label').style.display = 'none';
            document.querySelector('.ajout-photo p').style.display = 'none';
        }
        reader.readAsDataURL(file);
    }

    // Vérifier l'état des champs après le changement
    checkFormValidity();
});

// Réinitialiser l'aperçu de l'image en cliquant sur la croix
document.getElementById('remove-photo').addEventListener('click', function() {
    resetFormPreview();
});

// Réinitialiser le formulaire en fermant la modal
document.getElementById('modalClose2').addEventListener('click', function() {
    resetFormPreview();
    // Fermer la modal (supposons que vous avez une fonction ou méthode pour la fermer)
    document.getElementById('modal').close();
});

// Alimenter la BDD avec nouveaux projets - utilisation post
document.addEventListener('DOMContentLoaded', () => {
    chargementCategoriesProjets(); // Charger les catégories au chargement de la page

    const form = document.querySelector('.modal__form');
    const addButton = document.querySelector('.modal__footer__button2');
    const valeurInputTitre = document.getElementById("titre");
    const valeurInputImage = document.getElementById("photo");
    const valeurInputCatgory = document.getElementById("category");
    const modalAjout = document.getElementById('modal2');
    const modalGalerie = document.getElementById('modal1');

    // Ajouter des écouteurs d'événements sur les champs du formulaire pour vérifier la validité à chaque modification
    valeurInputTitre.addEventListener('input', checkFormValidity);
    valeurInputImage.addEventListener('change', checkFormValidity);
    valeurInputCatgory.addEventListener('change', checkFormValidity);

    // Vérifier la validité du formulaire au chargement de la page
    checkFormValidity();

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('image', valeurInputImage.files[0]);
        formData.append('title', valeurInputTitre.value);
        formData.append('category', valeurInputCatgory.value);
        console.log("valeur du formData : ", formData);
        
        try {
            const response = await fetch('http://localhost:5678/api/works', {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Erreur lors de l\'ajout du projet');
            }
            const result = await response.json();

            form.reset(); // Réinitialiser le formulaire après l'ajout
            resetFormPreview(); // Réinitialiser l'aperçu de l'image

            // Mettre à jour la galerie dans la modal galerie
            await worksModal();

            modalAjout.style.display = 'none';
            modalGalerie.style.display = 'block';

            A();
        } catch (error) {
            console.error('Erreur:', error);
            // alert(`Erreur lors de l'ajout du projet. Veuillez réessayer.\n${error.message}`);
        }
    });
});

async function A() {
    let gallery = document.querySelector(".gallery");
    gallery.innerHTML = ""; // Nettoie la galerie existante
    await works();
}
