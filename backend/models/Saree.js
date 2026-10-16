import mongoose from 'mongoose';

const sareeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Saree name is required'],
      trim: true
    },
    marathiName: {
      type: String,
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0
    },
    originalPrice: {
      type: Number,
      min: 0
    },
    category: {
      type: String,
      required: true,
      enum: ['Bridal', 'Pure Silk', 'Kadiyal', 'Brocade', 'Yeola Special', 'Personal Collection', 'Other'],
      default: 'Pure Silk'
    },
    color: {
      type: String,
      required: true
    },
    colorHex: {
      type: String,
      default: '#D4AF37'
    },
    palluMotif: {
      type: String,
      default: 'Mor Bangadi (Peacock)'
    },
    borderType: {
      type: String,
      default: 'Zari Border'
    },
    fabric: {
      type: String,
      default: '100% Pure Mulberry Silk'
    },
    zariType: {
      type: String,
      default: 'Pure Tested Gold Zari'
    },
    images: {
      type: [String],
      required: true,
      validate: [val => val.length > 0, 'At least one image is required']
    },
    isPersonalCollection: {
      type: Boolean,
      default: true
    },
    description: {
      type: String,
      default: ''
    },
    inStock: {
      type: Boolean,
      default: true
    },
    stockCount: {
      type: Number,
      default: 5
    },
    rating: {
      type: Number,
      default: 4.9
    },
    reviewsCount: {
      type: Number,
      default: 24
    },
    silkMarkCertified: {
      type: Boolean,
      default: true
    },
    handloom: {
      type: Boolean,
      default: true
    },
    origin: {
      type: String,
      default: 'Yeola, Maharashtra'
    }
  },
  {
    timestamps: true
  }
);

// Virtual for discount percentage
sareeSchema.virtual('discountPercentage').get(function () {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

const Saree = mongoose.models.Saree || mongoose.model('Saree', sareeSchema);
export default Saree;
