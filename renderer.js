// remove o comportamento de clicar e arrastar os links do menu
document.addEventListener('mousedown', function(e) {
  // Verifica se o elemento clicado eh um link
  const isLink = e.target.tagName.toLowerCase() === 'a';
  
  if (isLink) {
      e.preventDefault();
  }
});