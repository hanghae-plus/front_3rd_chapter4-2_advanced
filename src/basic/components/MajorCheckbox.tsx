import React, { memo } from "react"
import { Box, Checkbox } from "@chakra-ui/react"

interface Props {
  major: string
  onChange: () => void
}

const MajorCheckbox = memo(({ major, onChange }: Props) => {
  return (
    <Box key={major}>
      <Checkbox size="sm" value={major} onChange={onChange}>
        {major.replace(/<p>/gi, " ")}
      </Checkbox>
    </Box>
  )
})

export default MajorCheckbox
