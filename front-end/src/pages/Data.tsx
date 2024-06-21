import logo from '../images/logo-cropped.svg'

export interface IDataPage {
    id: number, type: string
}

const Data = (props: IDataPage) => {
    return (
        <>
            <img src={logo} style={{ position: 'absolute', top: '0px', height: '20vh', left: '40vh' }} />
            <div className="my-Header-Gradient App-header">

            </div>
            <div className="App-body">
                <div className="my-Form-Gradient my-Form-Container">
                    Your Report
                </div>
            </div>
        </>
    )
}

export default Data;