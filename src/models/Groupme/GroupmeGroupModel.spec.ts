import { expect } from 'chai';
import { GroupmeGroupModel } from './GroupmeGroupModel';

describe('Groupme Group Model Time Tests', () => {
  it('should return a proper created_at_date after setting one', () => {
    const model = new GroupmeGroupModel();
    const date = new Date(2020, 6, 14);

    // Use the setter to set the private created_at value
    model.created_at_date = date;

    // Use the getter to retrieve the value based on the created_at value
    const result = model.created_at_date;
    expect(result).to.eql(date);
  });

  it('should return null created_at_date when setting a null date', () => {
    const model = new GroupmeGroupModel();
    const date = null as Date;

    // Use the setter to set the private created_at value
    model.created_at_date = date;

    // Use the getter to retrieve the value based on the created_at value
    const result = model.created_at_date;
    expect(result).to.eq(date);
  });

  it('should return a proper updated_at_date after setting one', () => {
    const model = new GroupmeGroupModel();
    const date = new Date(2020, 6, 14);

    // Use the setter to set the private updated_at value
    model.updated_at_date = date;

    // Use the getter to retrieve the value based on the updated_at value
    const result = model.updated_at_date;
    expect(result).to.eql(date);
  });

  it('should return null updated_at_date when setting a null date', () => {
    const model = new GroupmeGroupModel();
    const date = null as Date;

    // Use the setter to set the private created_at value
    model.updated_at_date = date;

    // Use the getter to retrieve the value based on the created_at value
    const result = model.updated_at_date;
    expect(result).to.eq(date);
  });
});