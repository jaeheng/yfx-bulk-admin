import Plotly from 'plotly.js/lib/core'
import Bar from 'plotly.js/lib/bar'

// Load in the trace types for pie, box, heatmap, scattergl, violin, bar
Plotly.register([
  Bar
])

export default Plotly
