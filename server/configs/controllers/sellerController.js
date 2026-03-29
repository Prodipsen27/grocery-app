import jwt from 'jsonwebtoken';

// LOGIN SELLER
export const sellerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.SELLER_EMAIL &&
      password === process.env.SELLER_PASSWORD
    ) {
      const sellerToken = jwt.sign(
        { email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.cookie('sellerToken', sellerToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.json({ success: true, message: 'Logged In' });
    }

    return res.json({ success: false, message: 'Invalid Credentials' });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// CHECK SELLER AUTH (protected by authSeller middleware)
export const isSellerAuth = async (req, res) => {
  return res.json({ success: true });
};

// LOGOUT SELLER
export const sellerLogout = async (req, res) => {
  try {
    res.clearCookie('sellerToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return res.json({ success: true, message: 'Logged Out' });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
