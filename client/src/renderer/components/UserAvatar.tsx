import { Avatar } from '@mui/material'

const UserAvatar = ({
  user: { name },
  className,
}: {
  user: { name: string }
  className?: string
}) => (
  <Avatar className={className} title={name}>
    {name[0].toUpperCase()}
  </Avatar>
)

export default UserAvatar
