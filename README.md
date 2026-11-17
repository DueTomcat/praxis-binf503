# Kustomize

## 1. Team

| Name | Student ID | Tutorial group | GitHub username |
|---|---|---|---|
| Adham Yasser Elsayed Ahmed Ammar | 16001038 | T9 | DueTomcat |

## 2. The idea

Kustomize is a web app for businesses that make customized products, such as furniture, clothing or handmade items. Customers can submit requests with their specifications and reference images, while businesses can provide quotations, share designs for approval and track production. Each order has its own workspace, keeping everything organized in one place instead of scattered across messages and files.

## 3. Features

### 3.1 The full product

- **Customer and business accounts:** Separate views for customers placing orders and businesses handling them.
- **Custom order requests:** Customers describe what they want, add specifications and upload reference images.
- **Quotations:** Businesses send prices and estimated completion times, with options for the customer to choose from.
- **Design reviews:** Businesses upload previews; customers leave feedback on the images and approve the final version.
- **Production tracking:** Businesses set up the steps for each order and update progress as work gets done.
- **Change requests:** Customers can request changes to agreed specifications and track which approvals are needed again.
- **Reusable order forms:** Businesses can create templates for products they make regularly. *(Future feature.)*
- **Payments and delivery:** Deposits, invoices and shipping updates. *(Future feature.)*
- **Notifications and reporting:** Reminders for pending approvals and an overview of orders, deadlines and completed work. *(Future feature.)*

### 3.2 The use cases we will build

| # | Use case | What the user does | What they see | What is stored |
|---|---|---|---|---|
| 1 | Registration and login | Signs up with a name, email, password and account type (customer or business), then logs in | Their own home page and the orders they can access | A User record with a hashed password and account type |
| 2 | Create and manage an order | A customer chooses a business, fills in an order brief, adds specifications and reference images, then submits it. They can edit or delete a draft before it is accepted | The order brief and its current status | An Order containing the customer, business, requirements, images and status |
| 3 | Send and respond to quotations | A business sends a quote with one or more price options and estimated completion times. The customer accepts or rejects an option. The business can edit or delete an unaccepted draft quote | The available options, chosen price and quotation history | Quote records and the accepted option linked to the order |
| 4 | Review and approve designs | A business uploads a design preview. A customer can leave comments on specific parts of the image, ask for another version or approve it | The current preview, feedback pins, earlier versions and approval status | Design versions, image files, comments and the approved version |
| 5 | Track production | A business creates production steps for an order, updates each step and marks the job complete. Production cannot start until the current quote and design have been approved | Production progress and pending approvals | Production stages and progress saved on the Order |
| 6 | Request changes | Before production starts, a customer requests a change to an already agreed order. The business accepts or rejects it. If accepted, the order is updated and the quote and design need to be approved again | Requested changes and their approval status | A ChangeRequest, the updated order details and the new specification version |


## 4. Who owns what

| Member | Use case |
|---|---|
| Adham Yasser Elsayed Ahmed Ammar | 1. Registration and login |
| Adham Yasser Elsayed Ahmed Ammar | 2. Create and manage an order |
| Adham Yasser Elsayed Ahmed Ammar | 3. Send and respond to quotations |
| Adham Yasser Elsayed Ahmed Ammar | 4. Review and approve designs |
| Adham Yasser Elsayed Ahmed Ammar | 5. Track production |
| Adham Yasser Elsayed Ahmed Ammar | 6. Request changes |

## 5. Data model

### User

```js
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true }, // stored hashed, never as plain text
  role: { type: String, enum: ['customer', 'business'], required: true },
  businessName: { type: String, default: '' },
}, { timestamps: true });
```

### Order

```js
const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  business: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  quantity: { type: Number, required: true, min: 1 },
  specifications: [{
    name: { type: String, required: true },
    value: { type: String, required: true },
  }],
  referenceFiles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }],
  revision: { type: Number, default: 1 },
  acceptedQuote: { type: mongoose.Schema.Types.ObjectId, ref: 'Quote', default: null },
  approvedDesign: { type: mongoose.Schema.Types.ObjectId, ref: 'Design', default: null },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'quoted', 'design_review', 'ready', 'in_progress', 'completed'],
    default: 'draft',
  },
  productionSteps: [{
    name: { type: String, required: true },
    order: { type: Number, required: true },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date, default: null },
  }],
}, { timestamps: true });
```

### Quote

```js
const quoteSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  revision: { type: Number, required: true },
  options: [{
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    estimatedDays: { type: Number, required: true, min: 1 },
  }],
  selectedOption: { type: Number, default: null },
  status: {
    type: String,
    enum: ['draft', 'sent', 'accepted', 'rejected'],
    default: 'draft',
  },
}, { timestamps: true });
```

### Design

```js
const designSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  revision: { type: Number, required: true },
  version: { type: Number, required: true },
  image: { type: mongoose.Schema.Types.ObjectId, ref: 'File', required: true },
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    x: { type: Number, min: 0, max: 1 },
    y: { type: Number, min: 0, max: 1 },
  }],
  status: {
    type: String,
    enum: ['pending', 'changes_requested', 'approved'],
    default: 'pending',
  },
}, { timestamps: true });
```

### File

```js
const fileSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  filename: { type: String, required: true },
  mimeType: { type: String, required: true },
  data: { type: Buffer, required: true }, // image data
}, { timestamps: true });
```

### ChangeRequest

```js
const changeRequestSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fromRevision: { type: Number, required: true },
  reason: { type: String, required: true },
  proposedSpecifications: [{
    name: { type: String, required: true },
    value: { type: String, required: true },
  }],
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
}, { timestamps: true });
```

## 6. Run it locally

### Back end

```bash
cd backend
npm install
cp .env.example .env
npm start
```

The API runs at `http://localhost:3000».

| Environment variable | Description |
|---|---|
| `MONGODB_URI» | MongoDB connection string |
| `JWT_SECRET» | Secret used to sign authentication tokens |

### Front end

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:5173» by default.
