import jwt from 'jsonwebtoken'

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: 360 * 24 * 30 // Token expires in 30 days
  })
}

export default generateToken