# Five Loaves & Two Fish Website

This is a static website for the campus restaurant "Five Loaves & Two Fish" at Idia Hall, University of Ibadan with a full shopping cart ordering system.

## Features
- **Shopping Cart System**: Browse menu, add multiple items to cart, adjust quantities
- **Real-time Cart**: Floating cart icon shows item count from any page
- **WhatsApp Integration**: One-click order sending with auto-formatted message
- **Responsive Design**: Mobile-friendly layout with warm Nigerian food branding
- **Price Tracking**: Automatic total calculation including fixed and variable pricing

## How It Works
1. Customer browses the **Menu** page
2. Click "Add to Order" on any dish to add it to cart
3. Cart icon appears at bottom-left showing item count
4. Click the cart icon to open cart modal
5. Adjust quantities or remove items as needed
6. Enter name and delivery location
7. Click "Send Order to WhatsApp"
8. Pre-formatted order message opens in WhatsApp Business
9. Customer confirms and sends the order
10. Restaurant receives message with order details and sends payment info via automated reply

## Files
- `index.html` — Home page with hero, featured menu, and brand story
- `menu.html` — Full menu with Dishes, Soups, Proteins, and Extras
- `order.html` — Order instructions and workflow guide
- `about.html` — About page featuring story and values
- `contact.html` — Contact page with address, phone, and map
- `styles.css` — Site-wide styling, responsive layout, and cart UI
- `cart.js` — Shopping cart logic, localStorage persistence, WhatsApp integration
- `script.js` — Additional site functionality

## Cart Features
- **Persistent Storage**: Cart items saved to browser localStorage
- **Quantity Controls**: +/- buttons and manual input in cart modal
- **Item Removal**: Remove items from cart anytime
- **Auto-calculated Totals**: Real-time total with proper formatting
- **WhatsApp Message Template**:
  ```
  Hello, Five Loaves and Two Fish.
  My order is:
  - Qty x Item Name (₦Price)
  
  My location is [Delivery Location]
  Total amount is ₦[Amount]
  
  Can I have your account details?
  ```

## Run Locally
1. Open the project folder in VS Code
2. Open `index.html` in a browser
3. Or use a local server:
   ```powershell
   cd "c:\Users\DANIEL R\Desktop\Fives Loaves"
   python -m http.server 8000
   ```
   Then open `http://localhost:8000`

## Publish for Free

### GitHub Pages
1. Create a GitHub repository
2. Push this folder to the repo
3. Go to repo Settings → Pages
4. Set source to `main` branch, folder `/`
5. Save and visit the provided GitHub Pages URL
6. Site will be live at `https://yourusername.github.io/repo-name`

### Vercel
1. Sign in to [Vercel](https://vercel.com)
2. Import the GitHub repository
3. Use default settings for static site
4. Deploy and open the live preview
5. Site will be live at `https://your-site-name.vercel.app`

## Restaurant Info
- **Name**: Five Loaves & Two Fish
- **Location**: Idia Hall, University of Ibadan
- **Phone**: +2348030735623
- **Delivery**: Campus-wide service to Idia Hall area

## Design System
- **Primary Color**: Warm Orange (#FF6F00)
- **Accent Color**: Deep Red (#C62828)
- **Fonts**: Nunito (headings), Merriweather (body)
- **UI Elements**: Rounded buttons, card-based layouts, smooth animations
- **Imagery**: Nigerian food photography and cultural motifs

