import { useParams } from 'react-router-dom'
import React from 'react'

export default function Go(props) {
  const { articleId, startIndex, endIndex } = useParams()
  const params = {
    articleId, startIndex, endIndex
  };
  const Tool = props.tool;

  return (
    <Tool params={ params } />
  )
}