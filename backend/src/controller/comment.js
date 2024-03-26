const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const createComment = async (req, res) => {  
  try {
    const { description, DamageImageId, AccountCompanyId, GuestId } = req.body;

    // Check if the DamageImage exists
    const damageImage = await DamageImage.findById(DamageImageId);
    if (!damageImage) {
      return res.status(404).json({ message: 'DamageImage not found' });
    }

    // Check if the AccountCompany exists, if provided
    if (AccountCompanyId) {
      const accountCompany = await AccountCompany.findById(AccountCompanyId);
      if (!accountCompany) {
        return res.status(404).json({ message: 'AccountCompany not found' });
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
      AccountCompanyId,
      GuestId
    });

    await comment.save();

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createComment = createComment;