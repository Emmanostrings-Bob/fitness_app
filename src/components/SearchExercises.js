import React, {useEffect, useState} from 'react'
import { Box, Button, Stack, TextField, Typography } from '@mui/material'
import { exerciseOptions, fetchData } from '../utils/fetchData'
import HorizontalScrollbar from './HorizontalScrollbar';

const SearchExercises = ({ setExercises, bodyPart, setBodyPart}) => {
  const [search, setSearch] = useState('');
  const [bodyParts, setBodyParts] = useState([])

  
  const fetchExercisesData = async () => {
    try {
      const bodyPartsData = await fetchData('https://exercisedb.p.rapidapi.com/exercises/bodyPartList', exerciseOptions);
      setBodyParts(['all', ...bodyPartsData]);
    } catch (error) {
      if (error.response && error.response.status === 429) {
        // Handle the "429 Too Many Requests" error by waiting and retrying
        setTimeout(() => {
          fetchExercisesData();
        }, 5000); // Wait for 5 seconds before retrying (adjust as needed).
      } else {
        console.error('API Error:', error);
        // Handle other types of errors (e.g., display an error message to the user).
      }
    }
  };
   useEffect(() => {
   fetchExercisesData();
  }, [])
  

  const handleSearch = async () => {
    if (search) {
      try {
        const exercisesData = await fetchData('https://exercisedb.p.rapidapi.com/exercises', exerciseOptions);
  
        // Ensure exercisesData is an array before filtering
        if (Array.isArray(exercisesData)) {
          const searchExercises = exercisesData.filter(
            (exercise) =>
              exercise.name.toLowerCase().includes(search) ||
              (exercise.target?.toLowerCase()?.includes(search) ||
                exercise.equipment?.toLowerCase()?.includes(search) ||
                exercise.bodypart?.toLowerCase()?.includes(search))
          );
  
          setSearch('');
          setExercises(searchExercises);
        } else {
          console.error('API returned unexpected data format:', exercisesData);
        }
      } catch (error) {
        console.error('API Error:', error);
      }
    }
  };
  return (
    <Stack alignItems='center' mt='37px' justifyContent='center' p='20px'>
      <Typography fontWeight={700} sx={{
        fontSize: {lg: '44px', xs: '30px'}
      }}
      mb="50px" textAlign='center'
      >
        Cool Workouts You <br /> Should Know
      </Typography>
      <Box position='relative' mb='72px'>
        <TextField
        sx={{
          input: { fontWeight: '700px', border: 'none', borderRadius:'4px'},
         width: { lg: '800px', xs: '350px'}, backgroundColor: '#fff', 
         borderRadius: '40px',

        }}
          height= '76px'
          value={search}
          onChange={(e)=> setSearch(e.target.value.toLowerCase())}
          placeholder='Search Workouts'
          type='text'
        />
        <Button className='Search-btn'
        sx={{
          bgcolor: '#FF2625',
          color: '#fff',
          textTransform: 'none',
          width: { lg: '175px', xs: '80px'},
          fontSize: { lg: '20px', xs: '14px'},
          height: '56px',
          postion: 'absolute',
          right: '0'
        }}
        onClick={handleSearch}
        >
          Search
        </Button>
      </Box>
      <Box sx={{postion: 'relative', width: '100%', p: '20px'}}>
        <HorizontalScrollbar data={bodyParts} bodyPart = {bodyPart} setBodyPart = {setBodyPart} isBodyParts/>
      </Box>
    </Stack>
  )
}

export default SearchExercises