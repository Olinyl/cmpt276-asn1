var grades = [65.95, 56.98, 78.62, 96.1, 90.3, 72.24, 92.34, 60.00, 81.43, 86.22, 88.33, 9.03, 49.93, 52.34, 53.11, 50.10, 88.88, 55.32, 55.69, 61.68, 70.44, 70.54, 90.0, 71.11, 80.01];

// Add event listener to "New Grade" input
var newGradeInput = document.getElementById("new-grade-input");
newGradeInput.addEventListener("keyup", function(event) {
  if (event.key === "Enter") {
    addNewGrade();
  }
});

// Function to add a new grade to the grades array
function addNewGrade() {
    var newGrade = parseFloat(newGradeInput.value);
    if (isNaN(newGrade) || newGrade === "") {
      return; // Empty input or invalid grade
    }
  
    var lowerBounds = getLowerBounds();
    var gradeKeys = Object.keys(lowerBounds);
    var currentGradeIndex = gradeKeys.indexOf(event.target.id.replace('input-', ''));
    // Get the smallest and largest lower bounds
    var smallestLowerBound = lowerBounds[gradeKeys[gradeKeys.length - 1]];
    var largestLowerBound = parseFloat(document.getElementById("input-max").value); // Max is not included in the Lower Bound Grades

    // Check if the new grade is smaller than the smallest lower bound or larger than the largest lower bound
    if (newGrade < smallestLowerBound || newGrade > largestLowerBound) {
        return;
    }
  
    // Check if the new grade is greater than the lower bound above it
    if (currentGradeIndex > 0 && newGrade > lowerBounds[gradeKeys[currentGradeIndex - 1]]) {
      return;
    }
  
    grades.push(newGrade);
    updateHistogram();
    newGradeInput.value = "";
  }
  

// Function to update the histogram based on the current grades array
function updateHistogram() {
  var histogramGrades = document.getElementById("histogram-grades");
  histogramGrades.innerHTML = ""; // Clear existing histogram

  var gradeCounts = calculateGradeCounts();
  for (var grade in gradeCounts) {
    var count = gradeCounts[grade];
    var gradeElement = document.createElement("div");
    gradeElement.className = "histogram-grade";

    var gradeLabel = document.createElement("span");
    gradeLabel.className = "grade-label";
    gradeLabel.textContent = grade; // Grade label
    gradeElement.appendChild(gradeLabel);

    var barElement = document.createElement("div");
    barElement.className = "bar";
    barElement.style.width = count * 6 + "%"; // Set the width of the bar based on count
    gradeElement.appendChild(barElement);

    histogramGrades.appendChild(gradeElement);
  }
}

// Function to calculate the number of students in each grade range
function calculateGradeCounts() {
  var lowerBounds = getLowerBounds();
  var gradeCounts = {};

  // Initialize grade counts
  for (var grade in lowerBounds) {
    gradeCounts[grade] = 0;
  }

  // Count grades in each range
  for (var i = 0; i < grades.length; i++) {
    var grade = getGrade(grades[i], lowerBounds);
    gradeCounts[grade]++;
  }

  return gradeCounts;
}

// Function to get the lower bounds for each grade
function getLowerBounds() {
  var lowerBounds = {
    "A+": parseFloat(document.getElementById("input-a-plus").value),
    "A": parseFloat(document.getElementById("input-a").value),
    "A-": parseFloat(document.getElementById("input-a-minus").value),
    "B+": parseFloat(document.getElementById("input-b-plus").value),
    "B": parseFloat(document.getElementById("input-b").value),
    "B-": parseFloat(document.getElementById("input-b-minus").value),
    "C+": parseFloat(document.getElementById("input-c-plus").value),
    "C": parseFloat(document.getElementById("input-c").value),
    "C-": parseFloat(document.getElementById("input-c-minus").value),
    "D": parseFloat(document.getElementById("input-d").value),
    "F": parseFloat(document.getElementById("input-f").value)
  };

  return lowerBounds;
}

// Function to get the grade based on a numerical score and the lower bounds
function getGrade(score, lowerBounds) {
  for (var grade in lowerBounds) {
    if (score >= lowerBounds[grade]) {
      return grade;
    }
  }
  return "";
}

// Function to handle lower bounds change event
function LowerBoundsChange() {
  var lowerBoundElements = document.querySelectorAll("#lower-bound-section input[type='number']");
  var previousValue = Infinity; // Initialize previous value as positive infinity

  lowerBoundElements.forEach(function(element) {
    var currentValue = parseFloat(element.value);
    if (currentValue > previousValue) {
      element.value = previousValue; // Reset value to previous value
    } else {
      previousValue = currentValue; // Update previous value
    }
  });

  updateHistogram();
}

// Add event listeners to lower bounds input elements
var lowerBoundElements = document.querySelectorAll("#lower-bound-section input[type='number']");
lowerBoundElements.forEach(function(element) {
  element.addEventListener("change", LowerBoundsChange);
});

// Initial histogram update
updateHistogram();
