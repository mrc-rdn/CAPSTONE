import React from 'react'
import SendIcon from '@mui/icons-material/Send';

export default function Reply() {
  return (
    <div>
      <input type="text" />
      <button>Cancel</button>
      <button><SendIcon /></button>
    </div>
  )
}
