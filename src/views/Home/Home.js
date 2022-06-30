import React, { useEffect, useState } from 'react'
import { Button, Toolbar, Grid, Autocomplete, TextField, Paper, Box } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { Add, Bookmark, Delete, Remove } from '@mui/icons-material'
import db from 'db'
import { useLiveQuery } from 'dexie-react-hooks'
import { fetchStores } from 'api/store'
import { openSnack } from 'store/reducers/snack.slice'
import Dexie from 'dexie'

function Home() {
  const dispatch = useDispatch()
  const all = Dexie.Promise.all
  const [options, setOptions] = useState([])
  const [bookmarks, setBookmarks] = useState([])
  const user = useSelector(state => state.user)
  const liveBookmark = useLiveQuery(() => db.bookmarks.filter(item => item.author === user.id).toArray())
  const liveMap = useLiveQuery(() => db.home.filter(item => item.author === user.id).toArray())
  const liveRestaurants = useLiveQuery(() => db.stores.toArray())

  useEffect(() => {
    const stores = localStorage.getItem('stores')
    if (!Boolean(liveRestaurants) && !stores) fetchStores()
    if (Boolean(liveRestaurants) && Boolean(liveMap)) {
      console.log({ liveRestaurants })
      const list = liveMap.map(item => item.name)
      const data = liveRestaurants.map(item => {
        if (list.includes(item.fields.Name)) return { ...item, added: true }
        return { ...item, added: false }
      })
      setOptions(data)
    }
  }, [liveRestaurants, liveMap]);

  useEffect(() => {
    if (Boolean(liveBookmark)) {
      const data = liveBookmark.map(item=>item.name)
      setBookmarks(data)
    }
  }, [liveBookmark])

  const addMap = async (item) => {
    try {
      await db.home.put({ name: item, author: user.id })
    } catch (error) {
      console.log(error.message)
    }
  }

  const removeMap = async (item) => {
    try {
      await db.home.delete(item.name)
    } catch (error) {
      console.log(error.message)
    }
  }

  const addToBookmark = async (item) => {
    try {
      await db.bookmarks.put(item)
      dispatch(openSnack({ type: "success", text: "Map added to Bookmark section" }))
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <div>
      <Paper sx={{ p: 3, width: '100%', m: 0 }}>
        <Autocomplete
          id="checkboxes-tags-demo"
          options={options}
          disableCloseOnSelect
          getOptionLabel={(option) => option.fields.Name}
          renderOption={(props, option) => (
            <li {...props} style={{ display: 'flex', justifyContent: 'space-between' }}>
              {option.fields.Name}
              {option.added ?
                <Button startIcon={<Delete />} variant="outlined" onClick={() => removeMap({ name: option.fields.Name })}>Remove</Button> :
                <Button startIcon={<Add />} variant="outlined" onClick={() => addMap(option.fields.Name)}>Add</Button>}
            </li>
          )}
          style={{ width: 500 }}
          renderInput={(params) => (
            <TextField {...params} label="Select Restaurants" />
          )}
        />
      </Paper>
      <Toolbar />
      <Grid container spacing={3}>
        {liveMap && liveMap.map(item => (
          <Grid item key={item.name} xs={12} sm={6} md={4}>
            <Paper>
              <iframe
                width="100%"
                height="480"
                src={`https://datastudio.google.com/embed/reporting/430242fa-4162-4950-a984-824b3b355b3c/page/dQMwC?params=%7B"ds2.name2":"${item.name}"%7D`}
                allowFullScreen />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                {bookmarks.includes(item.name) ?
                <Button sx={{ m: 2, mr: 0 }} startIcon={<Remove />} onClick={() => addToBookmark(item)}>Remove from Bookmark</Button>:
                <Button sx={{ m: 2, mr: 0 }} startIcon={<Bookmark />} onClick={() => addToBookmark(item)}>Bookmark</Button>}
                
                <Button sx={{ m: 2 }} startIcon={<Delete />} onClick={() => removeMap(item)}>Remove</Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </div>
  )
}

export default Home