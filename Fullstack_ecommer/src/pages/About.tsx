import React from 'react'
import Title from '../Components/Title'
import { assets } from '../assets/assets'
import NewsLetterBox from '../Components/NewsLetterBox'

const About = () => {
  return (
    <div>
      <div className='text-2xl text-center pt-2'>
      <Title
      text1={'ABOUT'}
      text2={'US'}
      />
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-6'>
        <img src={assets.about_img}
        className='w-full md:max-w-[450px]'
        alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Cumque architecto deleniti asperiores dolores in repellat porro autem accusantium, magnam quae.</p>
        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Natus rem voluptate ea commodi fugit deleniti est, consequuntur alias eveniet molestiae perferendis blanditiis dolores accusantium? Fugit voluptates sit nam porro assumenda.</p>
        <b className='text-gray-800'>Our Mission</b>
        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Soluta cum dignissimos similique, harum maxime itaque odio vero, quisquam debitis ipsa error molestias laudantium dolorem aliquid!</p>
        </div>
      </div>

      <div className='text-xl py-4'>
      <Title
      text1={'WHY'}
      text2={'CHOOSE US'}
      />
      </div>

      <div className='flex flex-col  md:flex-row text-sm mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Quality Assurance:</b>
        <p className='text-gray-600'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Velit laborum, magni saepe error soluta aperiam eveniet commodi dicta nostrum alias.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Convenience:</b>
        <p className='text-gray-600'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Velit laborum, magni saepe error soluta aperiam eveniet commodi dicta nostrum alias.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Exceptional Customer Service:</b>
        <p className='text-gray-600'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Velit laborum, magni saepe error soluta aperiam eveniet commodi dicta nostrum alias.</p>
        </div>
      </div>
      <NewsLetterBox/>
    </div>
  )
}

export default About
