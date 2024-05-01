'use client'

import React from 'react'
import { FaMagnifyingGlass } from 'react-icons/fa6'
import { useDebouncedCallback } from 'use-debounce'

import { Category, Product } from '../../../../payload/payload-types'
import { useFilter } from '../../../_providers/Filter'

import classes from './index.module.scss'

const Search = ({ products, categories }: { products: Product[]; categories: Category[] }) => {
  const { productFilters, categoryFilters, sort, setProductFilters, setCategoryFilters, setSort } =
    useFilter()

  const handleSearch = useDebouncedCallback(term => {
    console.log(`Searching... ${term}`)

    setCategoryFilters([term])

    console.log('🚀 ~ Search ~ categoryFilters:', categoryFilters)
  }, 300)

  return (
    <div className={classes.searchWrapper}>
      <label htmlFor="search" className={classes.label}>
        Search
      </label>
      <input
        // className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        id="search"
        className={classes.input}
        placeholder="input search here"
        onChange={e => {
          handleSearch(e.target.value)
        }}
      />
      <FaMagnifyingGlass
        // className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"
        className={classes.magnifyingGlass}
      />
    </div>
  )
}

export default Search
