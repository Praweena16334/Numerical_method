import React, { Component } from 'react'
import { Button, Input,Table ,Card } from 'antd';
import { compile } from 'mathjs';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip} from 'recharts';
var dataInTable=[];
const columns = [
    {
        title: "Iteration",
        dataIndex: "iteration",
        key: "iteration",
    },
    {
        title: "XL",
        dataIndex: "l",
        key: "l",
    },
    {
        title: "XR",
        dataIndex: "r",
        key: "r",
    },
    {
        title: "XM",
        dataIndex: "m",
        key: "m",
    },
    {
        title: "Error",
        dataIndex: "error",
        key: "error",
    }
];

class FalsePosition extends Component {
  constructor() {
    super();
    this.state = {
      fx: '',
      xl: 0,
      xr: 0,
      showTable: false,
      showGraph: false,
      showH: false
    };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
  fx(X) {
    var expr = compile(this.state.fx);
    var scope = { x: parseFloat(X) };
    return expr.evaluate(scope);
}
falsePosition(xl, xr) {
    var i = 0;
    var point, xn;
    var xm = ( this.fx(xl)*xr - this.fx(xr)*xl )/( this.fx(xl) - this.fx(xr) )
    if (this.fx(xm) * this.fx(xr) > 0) {
        xr = xm
    }
    else {
        xl = xm
    }
    point = Math.abs((xn- xm) / xn);
    dataInTable.push({
        iteration: i,
        l: xl.toFixed(6),
        r: xr.toFixed(6),
        m: xm.toFixed(6),
        err: point.toFixed(6)
    })
    do {
        xn = ( this.fx(xl)*xr - this.fx(xr)*xl )/( this.fx(xl) - this.fx(xr) )
        if (this.fx(xn) * this.fx(xr) > 0) {
            xr = xn;
        }
        else {
            xl = xn;
        }
        point = Math.abs((xn - xm) / xn);
        xm = xn
        dataInTable.push({
            iteration: i + 1,
            l: xl.toFixed(6),
            r: xr.toFixed(6),
            m: xm.toFixed(6),
            err: point.toFixed(6)
        })
        i++;
    } while (point.toFixed(6) > 0.000001)
    this.setState({
        showTable: true,
        showGraph: true,
        showH: true
    })
  }

  render() {
    const testStyle={
      background: 'teal',
    };
    const boxsum={
      background: "green", 
      color: "black", 
      fontSize: "15px"
    };
    const backG={
      width: 1000, 
      height: 250,  
      background: "#999900", 
      color: "while"
    };
    return (
      <div>
        <section>
          <div>
            <form>
              <h3 style={testStyle}><a href="/">HOME</a></h3>
              <h1 style={{color:"blue"}}><center>False-Position Method</center></h1>
              <h3>F(x): <Input name="fx" size="large" style={{width: 300}} type="number" value={this.state.fx} onChange={this.handleChange} /></h3>
              <h3>x<sub>L</sub>: <Input name="xl" style={{width: 100}} type="number" onChange={this.handleChange} /></h3>
              <h3>x<sub>R</sub>: <Input name="xr" style={{width: 100}} type="number" onChange={this.handleChange} /></h3>
              <Button ghost onClick={() => this.falsePosition(parseFloat(this.state.xl), parseFloat(this.state.xr))}style={boxsum}>Submit</Button>
            </form>
            <br/><br/><br/><br/>
                    {this.state.showH && <h1 className="title">Graph of False Position</h1>}
                    <br/>
                    {this.state.showGraph && 
                    <Card style={backG}>
                        <LineChart width={1100} height={350} data={dataInTable}>
                            <Line type="monotone " dataKey="err" stroke="#CD5C5C" />
                            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                            <XAxis dataKey="iteration" />
                            <YAxis />
                            <Tooltip />
                        </LineChart>
                    </Card>
                    }
                    <br/><br/>
                    {this.state.showH && <h1 className="title">Table of False Position</h1>}
                    <br/>
                    {this.state.showTable &&
                        <Table
                        style={{ width: 1200}}columns={columns} dataSource={dataInTable} pagination={{ pageSize: 20 }} scroll={{ y: 300 }} />
                    }
          </div>
        </section>
      </div>
    );
  }
}
          
export default FalsePosition;