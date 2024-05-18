const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const createComment = async (req, res) => {  
  try {
    const { description, DamageImageId, AccountmanagerId, GuestId } = req.body;

    // Check if the DamageImage exists
    const damageImage = await DamageImage.findById(DamageImageId);
    if (!damageImage) {
      return res.status(404).json({ message: 'DamageImage not found' });
    }

    // Check if the Accountmanager exists, if provided
    if (AccountmanagerId) {
      const accountmanager = await Accountmanager.findById(AccountmanagerId);
      if (!accountmanager) {
        return res.status(404).json({ message: 'Accountmanager not found' });
      }
    }

    // Check if the Guest exists, if provided
    if (GuestId) {
      const guest = await Guest.findById(GuestId);
      if (!guest) {
        return res.status(404).json({ message: 'Guest not found' });
      }
    }

    // Create the comment
    const comment = new Comment({
      description,
      DamageImageId,
      AccountmanagerId,
      GuestId
    });

    await comment.save();

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createComment = createComment;