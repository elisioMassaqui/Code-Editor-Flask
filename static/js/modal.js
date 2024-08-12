function toggleModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    modalOverlay.style.display = modalOverlay.style.display === 'flex' ? 'none' : 'flex';
}

// Fechar modal ao clicar fora dele
document.addEventListener('click', function(event) {
    const modalOverlay = document.getElementById('modalOverlay');
    const modal = document.querySelector('.modal');
    if (modalOverlay.style.display === 'flex' && !modal.contains(event.target) && !event.target.closest('.btn')) {
        toggleModal();
    }
});