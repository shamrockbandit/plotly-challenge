  function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      var fin = metadata.filter(sampleObj => sampleObj.id == sample);
      var display = fin[0];
      var PANEL = d3.select("#sample-metadata");
  
      PANEL.html("");  
      Object.entries(display).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
    });
  }
  
  function buildCharts(sample) {
    d3.json("samples.json").then((data) => {
      var samples = data.samples;
      var fin = samples.filter(sampleObj => sampleObj.id == sample);
      var display = fin[0];
      var ids = display.otu_ids;
      var labels = display.otu_labels;
      var sample_values = display.sample_values;
      var y_ticks = ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
      var barData = [
        {
          type: "bar",
          y: y_ticks,
          x: sample_values.slice(0, 10).reverse(),
          text: labels.slice(0, 10).reverse(),
          orientation: "h",
        }
      ];
  
      var barSpecs = {
        title: "Top 10 Bacteria Cultures",
      };
  
      Plotly.newPlot("bar", barData, barSpecs);

      var bubbleSpecs = {
        title: "Bacteria Cultures Per Sample",
        xaxis: {title: "OTU ID"},
        yaxis: {title: "Cultures"},
      };
      var bubbleData = [
        {
          x: ids,
          y: sample_values,
          text: labels,
          mode: "markers",
          marker: {size: sample_values, color: ids,
          }
        }
      ];
  
      Plotly.newPlot("bubble", bubbleData, bubbleSpecs);
  
      
    });
  }
  
  function init() {
    var selector = d3.select("#selDataset");
  
    d3.json("samples.json").then((data) => {
      var sampleNames = data.names;
  
      sampleNames.forEach((sample) => {selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      var first = sampleNames[0];
      buildCharts(first);
      buildMetadata(first);
    });
  }
  
  function optionChanged(newSelect) {
    buildCharts(newSelect);
    buildMetadata(newSelect);
  }  
  init();
  