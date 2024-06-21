import Form from 'react-bootstrap/Form'
import { useState, useEffect, useRef } from 'react'
import ipInfo from '../resources/ipInfo.json'
import '../styles/bg-gradient.css'
import '../styles/Dropdown.css'

// shape of the incoming data
interface IDataResponse {
    [key: string]: any[][]
}

const SearchBar = (props: {
    // this is a function passed from the above component to render the search bar
    optionRender: (option: any[], index: number, onClick: () => void) => JSX.Element,
    // type as defined by the radio buttons from myForm.tsx
    type: string,
    // this is a function passed down from the above component to handle change in online status
    setBackEndStatus: any
}) => {

    // this differentiates the server between dev and prod
    const backEndHost: string = process.env.NODE_ENV == 'development' ? ipInfo.devHost : ipInfo.prodHost

    // states
    const [isOpen, setIsOpen] = useState(false)
    const [query, setQuery] = useState("")
    const [data, setData] = useState<IDataResponse>({
        "stock": [],
        "sector": [],
        "market": []
    })

    // this is a ref for the input bar to use when deciding 
    // what was clicked
    const inputRef = useRef(null)

    // click toggle is referenced by the event listener
    // to handle what happens when someone clicks something
    const clickToggle = (e: any) => {
        // if it is the input bar, it opens or stays open
        setIsOpen(e && e.target === inputRef.current)
    }

    // functional way to access the query value, not in use rn
    // const getValue = () => {
    //     if (query) return query
    //     return ""
    // }

    // handles what happens when an option gets selected from the searchbar
    const selectOption = (option: any[]) => {
        // deconstruct of the option list
        const [id, alternate_name, name, count] = option
        // finds the displayable name
        const useName = name == null ? alternate_name : name
        // sets query
        setQuery(() => useName)
        // closes the search options
        setIsOpen((isOpen) => !isOpen)
    }

    // function to get the data
    const pullTickers = async () => {
        try {
            const response = await fetch('http://' + ipInfo.devHost + ':3131/searchoptions', {
                method: 'GET', headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": "text/plain"
                }
            });
            const responseData = await response.json()
            props.setBackEndStatus("Online")
            setData(responseData)
        }
        catch (error) {
            console.log(error)
            props.setBackEndStatus("Offline")
        }
    }

    // adds a click listener to add click-out functionality to the searchbar
    useEffect(() => {
        document.addEventListener('click', clickToggle);
        return () =>
            document.removeEventListener('click', clickToggle);
    }, [])

    // filters the data based on the search query
    const myFilter = (options: any[][]): any[][] => (
        options.filter((option) => {
            // unpacks the list into components
            const [id, alternate_name, name, count] = option
            const useName = name == null ? alternate_name : name
            // uses indexof to string search
            return useName.toLowerCase().indexOf(query.toLowerCase()) > -1
        })
    )

    // This effect is to pull the data from the back for ticker info
    useEffect(() => { pullTickers() }, [props.type])

    return (
        <div className='dropdown'>
            <Form.Control value={query} ref={inputRef} placeholder={"Enter name"} onChange={(e) => { isOpen && setQuery(e.target.value) }}
                style={{ 'borderTopRightRadius': 0, 'borderBottomRightRadius': 0 }} />
            {isOpen && props.type && <div className="options my-Header-Gradient">
                {myFilter(data[props.type]).map((value: any[], index: number) => {
                    return (
                        props.optionRender(value, index, () => selectOption(value))
                    )
                })}
            </div>}
        </div>
    )
}

export default SearchBar;