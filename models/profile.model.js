const supabase = require('../config/supabase')

const ProfileModel = {

  async findById(id) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw new Error(error.message)
    return data
  },

  async create(data) {
    const { data: result, error } = await supabase
      .from('profiles')
      .insert(data)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return result
  },

  async update(id, data) {
    const { data: result, error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return result
  },

  async findAll() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw new Error(error.message)
    return data
  },

  async findByRole(role) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', role)
      .order('created_at', { ascending: false })
    if (error) throw new Error(error.message)
    return data
  },

  async delete(id) {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id)
    if (error) throw new Error(error.message)
    return true
  },

  async existsById(id) {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', id)
      .single()
    if (error) return false
    return !!data
  }

}

module.exports = ProfileModel