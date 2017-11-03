module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('Feedbacks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      project_cost: {
        type: Sequelize.RANGE(Sequelize.INTEGER),
      },
      is_price_confidential: {
        type: Sequelize.BOOLEAN,
      },
      job_title: {
        type: Sequelize.STRING,
      },
      job_description: {
        type: Sequelize.TEXT,
      },
      quoted_job_description: {
        type: Sequelize.TEXT,
      },
      quality_of_work: {
        type: Sequelize.INTEGER,
      },
      quality_of_price: {
        type: Sequelize.INTEGER,
      },
      quality_of_friendliness: {
        type: Sequelize.INTEGER,
      },
      quality_of_timeschedule: {
        type: Sequelize.INTEGER,
      },
      is_displaying: {
        type: Sequelize.BOOLEAN,
      },
      is_displaying_quote: {
        type: Sequelize.BOOLEAN,
      },
      is_approved: {
        type: Sequelize.BOOLEAN,
      },
      photo_urls: {
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      likes: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
      },
      replies: {
        type: Sequelize.JSON,
      },
      provider_email: {
        type: Sequelize.STRING,
      },
      rater_id: {
        type: Sequelize.INTEGER,
      },
      provider_id: {
        type: Sequelize.INTEGER,
      },
      service_id: {
        type: Sequelize.INTEGER,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down(queryInterface, Sequelize) {
    return queryInterface.dropTable('Feedbacks');
  },
};
