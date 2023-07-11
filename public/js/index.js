const sidebar = document.querySelector('.sidebar');
const root = document.querySelector(':root');

function updateSidebarWidth() {
  const sidebarWidth = sidebar.getBoundingClientRect().width;
  root.style.setProperty('--sidebar-width', sidebarWidth + 'px');
  console.log(sidebarWidth);
}

// Call the updateSidebarWidth function whenever the window is resized
window.addEventListener('resize', updateSidebarWidth);

// Call the updateSidebarWidth function initially to set the sidebar width
updateSidebarWidth();