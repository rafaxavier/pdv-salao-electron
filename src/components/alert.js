export function showAlert() {
    const modal = document.getElementById("custom-alert");
    const closeButton = document.getElementsByClassName("close-btn")[0];
    const confirmButton = document.getElementById("confirm-delete");
    const cancelButton = document.getElementById("cancel-delete");
  
    return new Promise((resolve, reject) => {
      modal.style.display = "block";
      closeButton.onclick = function () {
        modal.style.display = "none";
        reject();
      };
  
      cancelButton.onclick = function () {
        modal.style.display = "none";
        reject();
      };
  
      confirmButton.onclick = function () {
        modal.style.display = "none";
        resolve();
      };
  
      window.onclick = function (event) {
        if (event.target == modal) {
          modal.style.display = "none";
          reject();
        }
      };
    });
  }