const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  Tag.findAll({
    attributes: ['id', 'tag_name'],
    include: [
      {
        model: Product,
        attributes: ['id', 'product_name', 'price', 'stock', 'category_id']
      }
    ]
  })
  .then(dbTagData => res.json(dbTagData))
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

router.get('/:id', (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  Tag.findOne({
    attributes: ['id', 'tag_name'],
    where: {
      id: req.params.id
    },
    include: {
      model: Product,
      attributes: ['id', 'product_name', 'price', 'stock', 'category_id']
    }
  })
  .then(dbTagData => {
    if(!dbTagData) {
      res.status(404).json({message: 'No tag was found with this id!'});
      return;
    }
    res.json(dbTagData)
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  })
});

router.post('/', (req, res) => {
  /* req.body should look like this...
    {
      tag_name: "Purple",
    }
  */  
  // create a new tag
  Tag.create(req.body)
  .then(dbTagData => res.json({message: 'Tag created!', dbTagData}))
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
    
});

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
  Tag.update(req.body, {
    where: {
      id: req.params.id
    }
  })
  .then(async() => {    
    const id = await Tag.findOne({
      where: {
        id: req.params.id
      }
    });

    if (!id) {
      res.status(404).json({message: 'No tag found with this id!'});
      return;
    }
    res.json({message: `Updated tag name to ${req.body.tag_name}!`});
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value
  Tag.destroy({
    where: {
      id: req.params.id
    }
  })
  .then(dbTagData => {
    if (!dbTagData) {
      res.status(404).json({message: 'No tag found with that id'});
      return;
    }
    res.json({message: 'Tag deleted!'})
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

module.exports = router;
