import eel
import sqlite3

# Connect to the database
db_name = 'inventory.db'
conn = sqlite3.connect(db_name)
c = conn.cursor()


# Create the GUI
eel.init('web')

@eel.expose
def search_data(query, criteria):
    c.execute("""
        SELECT 
            i.item_name, 
            i.SKU, 
            i.quantity, 
            i.price,
            GROUP_CONCAT(c.crystal_name, ', ') AS crystal_names, 
            i.description 
        FROM 
            inventory i 
        LEFT JOIN 
            inventory_crystals ic ON i.item_id = ic.inventory_id 
        LEFT JOIN 
            crystals c ON ic.crystal_id = c.crystal_id 
        WHERE 
            i.""" + criteria + """ LIKE ? 
        GROUP BY 
            i.item_id""", ('%' + query + '%',))
    return c.fetchall()

@eel.expose
def get_item_types():
    conn = sqlite3.connect(db_name)
    c = conn.cursor()
    c.execute("SELECT type_id, type_name FROM item_types")
    result = c.fetchall()
    conn.close()
    return result

@eel.expose
def get_crystals():
    conn = sqlite3.connect(db_name)
    c = conn.cursor()
    c.execute("SELECT crystal_id, crystal_name FROM crystals")
    result = c.fetchall()
    conn.close()
    return result


@eel.expose
def get_crystal_types(crystal_id):
    conn = sqlite3.connect(db_name)
    c = conn.cursor()
    c.execute("SELECT * FROM crystals WHERE crystal_id = ?", (crystal_id,))
    crystal = c.fetchone()
    if crystal:
        c.execute("SELECT * FROM crystals WHERE crystal_name = ?", (crystal[1],))
        crystal_types = c.fetchall()
        return [{'id': crystal_type[0], 'name': crystal_type[2]} for crystal_type in crystal_types]
    else:
        return []

@eel.expose
def get_materials():
    conn = sqlite3.connect(db_name)
    c = conn.cursor()
    c.execute("SELECT material_id, material_name FROM materials")
    result = c.fetchall()
    conn.close()
    return result


@eel.expose
def add_items(items):
    for item in items:
        # Add item to database
        conn = sqlite3.connect(db_name)
        c = conn.cursor()
        c.execute("INSERT INTO inventory (item_name, description, SKU, quantity, price, type_id, contains_crystals) VALUES (?, ?, ?, ?, ?, ?, ?)",
                  (item['item_name'], item['description'], item['sku'], item['quantity'], item['price'], get_item_type_id(item['item_type']), item['contains_crystals']))
        item_id = c.lastrowid
        if item['contains_crystals']:
            if item['crystal'] == 'new':
                c.execute("INSERT INTO crystals (crystal_name, crystal_style) VALUES (?, ?)", (item['crystal_name'], item['crystal_style']))
                crystal_id = c.lastrowid
            else:
                c.execute("SELECT crystal_id FROM crystals WHERE crystal_name = ?", (item['crystal'],))
                crystal_id = c.fetchone()[0]
            c.execute("INSERT INTO inventory_crystals (inventory_id, crystal_id) VALUES (?, ?)", (item_id, crystal_id))
        for material in item['materials']:
            if material['material_name'] == 'new':
                c.execute("INSERT INTO materials (material_name, material_description) VALUES (?, ?)", (item['material_name'], item['material_description']))
                material_id = c.lastrowid
            else:
                c.execute("SELECT material_id FROM materials WHERE material_name = ?", (material['material_name'],))
                material_id = c.fetchone()[0]
            c.execute("INSERT INTO inventory_materials (inventory_id, material_id) VALUES (?, ?)", (item_id, material_id))
        conn.commit()
        conn.close()

def get_item_type_id(item_type):
    conn = sqlite3.connect(db_name)
    c = conn.cursor()
    c.execute("SELECT type_id FROM item_types WHERE type_name = ?", (item_type,))
    result = c.fetchone()
    if result:
        return result[0]
    else:
        c.execute("INSERT INTO item_types (type_name) VALUES (?)", (item_type,))
        return c.lastrowid
    conn.close()


@eel.expose
def delete_item(sku):
    c.execute("SELECT item_id FROM inventory WHERE SKU = ?", (sku,))
    item_id = c.fetchone()[0]
    c.execute("DELETE FROM inventory WHERE SKU = ?", (sku,))
    c.execute("DELETE FROM inventory_materials WHERE inventory_id = ?", (item_id,))
    c.execute("DELETE FROM inventory_crystals WHERE inventory_id = ?", (item_id,))
    conn.commit()

@eel.expose
def update_item(item):
    c.execute("UPDATE inventory SET item_name = ?, description = ?, quantity = ?, price = ? WHERE SKU = ?", (item['item_name'], item['description'], item['quantity'], item['price'], item['sku']))
    conn.commit()

@eel.expose
def generate_report(quantity):
    c.execute("SELECT * FROM inventory WHERE quantity < ?", (quantity,))
    return c.fetchall()

@eel.expose
def increase_quantity(sku):
    c.execute("SELECT quantity FROM inventory WHERE SKU = ?", (sku,))
    current_quantity = c.fetchone()[0]
    new_quantity = current_quantity + 1
    c.execute("UPDATE inventory SET quantity = ? WHERE SKU = ?", (new_quantity, sku))
    conn.commit()

@eel.expose
def decrease_quantity(sku):
    c.execute("SELECT quantity FROM inventory WHERE SKU = ?", (sku,))
    current_quantity = c.fetchone()[0]
    if current_quantity > 0:
        new_quantity = current_quantity - 1
        c.execute("UPDATE inventory SET quantity = ? WHERE SKU = ?", (new_quantity, sku))
        conn.commit()

@eel.expose
def adjust_quantity(sku, quantity):
    c.execute("SELECT quantity FROM inventory WHERE SKU = ?", (sku,))
    current_quantity = c.fetchone()[0]
    new_quantity = current_quantity + quantity
    if new_quantity < 0:
        new_quantity = 0
    c.execute("UPDATE inventory SET quantity = ? WHERE SKU = ?", (new_quantity, sku))
    conn.commit()

eel.start('html/index.html', size=(1400, 900))

# Close the connection
conn.close()