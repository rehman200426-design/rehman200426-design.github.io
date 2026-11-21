document.querySelectorAll('.tech-icons a').forEach(link => {
  link.addEventListener('click', () => {
    const detail = document.querySelector(link.hash);
    if (detail) detail.open = true;
  });
});
