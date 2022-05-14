/*
 * This is the javascript file that is used for analyst.ejs
 * All the charts are created here
*/

// Creates title
function createTile(title, removable) {
    var tile = document.createElement('div');
    tile.classList.add('tile');
    var tileTitle = document.createElement('h2');
    tileTitle.innerHTML = title;
    return tile;
}

// Color scheme of charts
var barColors = [
    '#ff6361',
    '#ffa600',
    '#003f5c',
    '#955196',
    '#ff6e54',
    '#58508d',
    '#bc5090'
];

// Design options for bar and horizontal bar charts
var horizontalBaroptions= {plugins:{display: false}, indexAxis: 'y'};
var Baroptions= {plugins: {labels: {fontColor: 'rgb(229, 232, 235)'}}};

// Dictionary containing all charts used and their types
// horizontalBar, doughnut, bar, horizontalBar, pie
var charts = new Object();
charts =  {
    "reportOsBar": 'bar',
    "closingDate": 'bar',
    "commonSoftware": "bar",
    "statusDough": "graph",
    "problemType": "horizontalBar",
    "commonHardware": "horizontalBar"
};

// Array with values of keys in chart details
const queries= ["reportOsBar", "closingDate", "commonSoftware",  "status", "problemType", "commonHardware"];

// Global chart values
Chart.defaults.global.defaultFontSize = 10;
Chart.defaults.global.legend.display = false; 
Chart.defaults.global.defaultFontFamily = "'Space Grotesk', sans-serif";


/** This function creates a pie/doughnut chart
 * @param string chart_type Type of chart
 * @param string chart_name Name of chart
 * @param object data Object containing chart data to be displayed
 */
function createChart(chart_type, chart_name, label_data,  data) {
    var new_chart = new Chart(document.getElementById(chart_name), {
        type: chart_type,
        data: {
            labels: label_data,
            datasets: [{
                backgroundColor: barColors,
                data: data,
                borderColor: 'black',
                hoverBorderWidth: 3,
                hoverBorderColor: 'black'
            }]
        },
        // Styling specs for chart
        options: {
            plugins: {
              labels: {
                fontColor: 'black',
                position: 'outside',
                fontSize: 12,
                textMargin: 6
              }
              }
            },
            responsive: true,
            elements: {
              arc: {
                borderWidth: 0
              }
          },
            layout: {
              padding: {
                top: 20,
                left: 40
              }
          }
    });
}

/** Creates a bar chart
 * @param string chart_type Type of chart
 * @param string chart_name Name of chart
 * @param object data containing chart data displayed
 */
function createBarChart(chart_type, chart_name, label_data, data) {
    var new_chart = new Chart(chart_name, {
        type: chart_type,
        data: {
          labels: label_data,
          datasets: [{
            backgroundColor: barColors,
            data: data,
            borderColor: 'black',
            hoverBorderWidth: 3,
            hoverBorderColor: 'black'
          }]
        },
        options: {
            plugins: {
                labels: {
                    fontColor: 'rgb(255, 255, 255)',
                }
            },
            indexAxis: 'y',
            layout: {
                padding: {
                    top: 20,
                }
            },
            scales:{
                xAxes:[{
                    gridLines: {
                        display: false,
                        color: 'rgb(255, 255, 255)'
                    },
                    ticks:{
                        beginAtZero: true,
                        fontColor: 'black'
                    },
                }],
                yAxes:[{
                    gridLines: {
                        color: 'rgb(255, 255, 255)'
                    },
                    ticks:{
                        beginAtZero: true,
                        fontColor: 'black'
                    }
                }],
                plugins: {
                    legend: {
                        display: false,
                        labels: {
                            font: {
                                family: 'sans-serif',
                            }
                        }
                    }
                }
            }    
        }    
    });      
}

document.addEventListener('DOMContentLoaded', function() {

    console.log("loading graphs... ")

    // Assigned tickets per Specialist data
    let names = [];
    let counter = [];
    user_data.forEach(function(user){
        names.push(user.name);
        counter.push(count[user.name]);
    });

    // Common Software Data
    let softwareCount = [];
    softwareList.forEach(function(software){
        softwareCount.push(countPerSoftware[software])
    });

    // Common Hardware Data
    let hardwareCount = [];
    let hardwareMergeList = [];
    hardwareList.forEach(function(hardware){
        console.log(hardware);
        if (!hardwareMergeList.includes(hardware)) {
            hardwareMergeList.push(hardware);
            hardwareCount.push(countPerHardware[hardware])
        }
    });

    // OS Data
    let osCount = [];
    osList.forEach(function(os){
        osCount.push(countPerOs[os]);
    });

    // Status Data
    let statusCount = [];
    statusList.forEach(function(status){
        statusCount.push(countPerStatus[status]);
    })

    // Problem Type Data
    let totalCountsTypes = [];
    problemTypes.forEach(function(type){
        totalCountsTypes.push(totalCounts[type]);
    })

    createChart('pie', 'reportOsBar', osList, osCount);

    createBarChart('bar', 'commonHardware', hardwareMergeList, hardwareCount);

    createChart('pie', 'commonSoftware', softwareList, softwareCount);

    createChart('doughnut', 'statusDough', statusList, statusCount);

    createChart('doughnut', 'problemType', problemTypes, totalCountsTypes);

});
