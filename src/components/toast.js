export function myToast(msg, type) {
    const toastBox = document.createElement('div');

    if (type === 'success') {
        toastBox.style.backgroundColor = 'green';
    } else if (type === 'error') {
        toastBox.style.backgroundColor = 'red';
    } else if (type === 'info') {
        toastBox.style.backgroundColor = 'blue';
    } else if (type === 'warning') {
        toastBox.style.backgroundColor = 'orange';
    } else {
        toastBox.style.backgroundColor = 'grey'; // Default case
    }

    toastBox.style.width = '230px';
    toastBox.style.color = 'white';
    toastBox.style.padding = '20px';
    toastBox.style.position = 'fixed';
    toastBox.style.top = '20px';
    toastBox.style.right = '20px';
    toastBox.style.zIndex = 1000;
    toastBox.style.borderRadius = '5px';
    const toastMessage = document.createElement('p');
    toastMessage.textContent = msg;
    toastMessage.style.margin = 0;

    toastBox.appendChild(toastMessage);

    document.body.appendChild(toastBox);

    setTimeout(() => {
        document.body.removeChild(toastBox);
    }, 3000);
}