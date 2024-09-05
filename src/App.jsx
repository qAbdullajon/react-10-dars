import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'

const App = () => {
  const [data, setData] = useState([])
  const [isPressed, setPressed] = useState(null)
  const [search, setSearch] = useState('')
  const nameRef = useRef()
  const priceRef = useRef()
  const colorRef = useRef()
  useEffect(() => {
    getRequest()
  }, [])
  const getRequest = () => {
    axios.get('http://localhost:8000/products').then((response) => {
      if (response.status === 200) {
        setData(response.data)
      }
    })
  }
  const hendleSubmit = (e) => {
    e.preventDefault()
    let form = {
      name: nameRef.current.value,
      price: priceRef.current.value,
      color: colorRef.current.value
    }
    axios.post('http://localhost:8000/products', form).then((response) => {
      getRequest()
    })
    nameRef.current.value = ''
    priceRef.current.value = ''
    colorRef.current.value = ''
  }
  const hendleDelete = (id) => {
    axios.delete(`http://localhost:8000/products/${id}`).then((res) => {
      if (res.status === 200) {
        getRequest()
      }
    })
  }
  const hendleEdite = (product) => {
    setPressed(product.id)
  }
  const hendleSave = (product) => {
    setPressed(null)
    const new_product = {
      name: nameRef.current.value,
      price: priceRef.current.value,
      color: colorRef.current.value
    }
    axios.put(`http://localhost:8000/products/${product.id}`, new_product).then((res) => {
      getRequest()
    })
  }
  const hendleChange = (e) => {
    setSearch(e.target.value.trim().toLowerCase())
  }
  return (
    <div className='px-[5%] pt-6'>
      <div>
        <form onSubmit={hendleSubmit}>
          <input ref={nameRef} className='border outline-none px-2 py-1 text-xl' type="text" placeholder='Name' />
          <input ref={priceRef} className='border outline-none px-2 py-1 text-xl' type="text" placeholder='Price' />
          <input ref={colorRef} className='border outline-none px-2 py-1 text-xl' type="text" placeholder='Color' />
          <button className='border outline-none px-4 bg-green-600 text-white py-1 text-xl'>Add products</button>
        </form>
      </div>
      <div className='pt-10'>
        <div>
          <input onChange={hendleChange} className='border outline-none px-2 py-1 mb-2' type="text" placeholder='Search...' />
        </div>
        <table className='w-full'>
          <thead>
            <tr>
              <th className='border'>T/H</th>
              <th className='border'>Name</th>
              <th className='border'>Price</th>
              <th className='border'>Color</th>
              <th className='border w-[250px]'>Action</th>
            </tr>
          </thead>
          <tbody>
            {
              data.filter(item => item.name.toLowerCase().includes(search)).map((item, i) => {
                return <tr key={i}>
                  <td className='border text-center'>{i + 1}</td>
                  <td className='border text-center'>
                    {
                      isPressed == item.id ? <input className='border px-1' ref={nameRef} type='text' placeholder='Name' defaultValue={item.name} /> : <span>{item.name}</span>
                    }
                  </td>
                  <td className='border text-center'>
                    {
                      isPressed == item.id ? <input className='border px-1' ref={priceRef} type='text' placeholder='Price' defaultValue={item.price} /> : <span>{item.price}</span>
                    }
                  </td>
                  <td className='border text-center'>
                    {
                      isPressed == item.id ? <input className='border px-1' ref={colorRef} type='text' placeholder='Color' defaultValue={item.color} /> : <span>{item.color}</span>
                    }
                  </td>
                  <td className='border text-center flex justify-center w-[250px] gap-3'>
                    <button onClick={() => hendleDelete(item.id)} className='bg-red-500 text-white px-4 text-lg'>Delete</button>
                    {
                      isPressed === item.id ?
                        <button onClick={() => { hendleSave(item) }} className='text-white px-4 text-lg bg-orange-500'>Save</button> :
                        <button onClick={() => hendleEdite(item)} className='text-white px-4 text-lg bg-orange-400'>Edite</button>
                    }
                  </td>
                </tr>
              })
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default App