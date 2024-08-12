'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Box, Stack, Typography, Button, TextField, InputAdornment } from '@mui/material'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { firestore } from '@/firebase'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
}



export default function Home() {
  // We'll add our component logic here

  const [inventory, setInventory] = useState([])
  const [itemName, setItemName] = useState('')

  
  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() })
    })
    setInventory(inventoryList)
  }
  
  useEffect(() => {
    updateInventory()
  }, [])

  const addItem = async (item) => {
    if (!item) {return}
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }
    await updateInventory()
  }
  
  const removeItem = async (item, voidAmount=1) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity <= voidAmount || isNaN(quantity) ) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - voidAmount })
      }
    }
    await updateInventory()
  }



  let columnSpacing = 5
  return (
  
  <Box
    width="100vw"
    height="100vh"
    display={'flex'}
    justifyContent={'center'}
    flexDirection={'column'}
    alignItems={'center'}
    gap={2}
  >
    
    <Box border={'1px solid #333'}>
      <Box
        width="800px"
        height="100px"
        bgcolor={'#ADD8E6'}
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
        sx={{
          background: `repeating-linear-gradient(90deg, red, red ${21 + columnSpacing}px, gold ${21 + columnSpacing}px, gold ${41 + columnSpacing}px)`,
          // Adjust the pattern size by changing the pixel values
          border: '1px solid black', // Optional: add a border for better visibility
        }}
      >
        <Box
          bgcolor={'#f00'}
          width="800px"
          height="90px"
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          sx={{
            background: `repeating-linear-gradient(90deg, red, red ${26 + columnSpacing}px, gold ${26 + columnSpacing}px, gold ${36 + columnSpacing}px, red ${36 + columnSpacing}px, red ${41 + columnSpacing}px)`,
            // Adjust the pattern size by changing the pixel values
            
          }}
        >
          <Box
            sx={{
              background: 'red'
            }}>
            <Typography variant="h2"
              sx={{
                textAlign: 'center',
                background: 'linear-gradient(to right, gold, gold)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                // Ensure the gradient covers the text properly
                display: 'inline-block',
              }}>
              Inventory Items
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        width="800px"
        height="80px"
        bgcolor={'#ffffff'}
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        

        <TextField
          label="Select Item"
          value={itemName}
          onChange={(e) => {setItemName(e.target.value)}}
          onKeyDown={(e) => {if (e.key === 'Enter') {addItem(itemName)}}}
          variant='outlined'
          fullWidth
          border={2}
          sx={{ m: 2 }}
          InputProps={{
            startAdornment: <InputAdornment position="start"><Button onClick={()=>{removeItem(itemName, 1)}}><RemoveIcon color={'error'}></RemoveIcon></Button>/<Button onClick={()=>{addItem(itemName)}}><AddIcon color={'success'}></AddIcon></Button></InputAdornment>, 
            endAdornment: <InputAdornment position="end"><Button onClick={()=>{setItemName('')}}><ClearIcon color={'disabled'}></ClearIcon></Button></InputAdornment>,
          }}
        >

        </TextField>

      
      </Box>
      <Stack width="800px" height="300px" spacing={2} overflow={'auto'}>
        {inventory.filter(({name}) => {return name.startsWith(itemName)}).map(({name, quantity}) => (
          <Box
            key={name}
            width="100%"
            minHeight="150px"
            display={'flex'}
            justifyContent={'space-between'}
            alignItems={'center'}
            bgcolor={'#f0f0f0'}
            paddingX={5}
          >
            <Typography variant={'h4'} color={'#333'} textAlign={'center'}>
              {name}
            </Typography>
            <Typography variant={'h4'} color={'#333'} textAlign={'center'}>
              Quantity: {quantity}
            </Typography>
            <Box>
              <Button variant="contained" onClick={() => removeItem(name, 1)}>
                Remove
              </Button>
              <Button 
                variant='contained'  
                color='error' 
                onClick={() => removeItem(name, Infinity)} 
                startIcon={<DeleteForeverIcon style={{ paddingRight: 0 , fontSize: '1.5rem' }}></DeleteForeverIcon>}>
              </Button>
            </Box>
            
          </Box>
        ))}
      </Stack>
    </Box>
  </Box>
)
}