const sidebar = document.querySelector(".sidebar");
const pieChart = document.querySelector(".pieChart");
const root = document.querySelector(":root");

function updateSidebarWidth() {
  const sidebarWidth = sidebar.getBoundingClientRect().width;
  const pieChartWidth = Math.round(pieChart.getBoundingClientRect().width);
  root.style.setProperty("--sidebar-width", sidebarWidth + "px");
  root.style.setProperty("--piechart-width", pieChartWidth + "px");
  console.log(sidebarWidth);
  console.log(pieChartWidth);
}

// Call the updateSidebarWidth function whenever the window is resized
window.addEventListener("resize", updateSidebarWidth);

// Call the updateSidebarWidth function initially to set the sidebar width
updateSidebarWidth();

