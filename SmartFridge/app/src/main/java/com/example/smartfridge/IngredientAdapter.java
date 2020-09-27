package com.example.smartfridge;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.cardview.widget.CardView;

import org.w3c.dom.Text;

public class IngredientAdapter extends BaseAdapter {

    private final String[] name;
    private final int[] image;
    private final int[] qty;
    private final int[] exp;
    private final Context context;
    private final Bitmap[] imageBP;
    private final int[] imageNull;

    public IngredientAdapter(String[] name, int[] image, int[] qty, int[] exp, Context context, Bitmap[] imageBP, int[] imageNull) {
        this.name = name;
        this.image = image;
        this.qty = qty;
        this.exp = exp;
        this.context = context;
        this.imageBP = imageBP;
        this.imageNull = imageNull;
    }

//    public IngredientAdapter(View view) {
//        imageView = view.findViewById(R.id.empty_ingre);
//        textView1 = view.findViewById(R.id.ingre_name);
//        textView2 = view.findViewById(R.id.ingre_exp);
//    }

    @Override
    public int getCount() {
        return name.length;
    }

    @Override
    public Object getItem(int position) {
        return null;
    }

    @Override
    public long getItemId(int position) {
        return 0;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {

        if (convertView == null) {
            LayoutInflater layoutInflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
            convertView = layoutInflater.inflate(R.layout.ingr_card, null);
        }

        CardView cardView = (CardView)convertView.findViewById(R.id.ingre_card);

        ImageView ingredientImage = (ImageView)convertView.findViewById(R.id.empty_ingre);
        TextView ingredientName = (TextView)convertView.findViewById(R.id.ingre_name);
        TextView ingredientQty = (TextView)convertView.findViewById(R.id.ingre_exp);

        if (imageNull[position] == 0) {
            ingredientImage.setImageBitmap(imageBP[position]);
        } else {
            ingredientImage.setImageResource(image[position]);
        }
        ingredientName.setText(name[position]);
        ingredientQty.setText("QTY: " + qty[position]);

        if (exp[position] < 3) cardView.setCardBackgroundColor(Color.parseColor("#fff35272"));
        else if (exp[position] >= 3 && exp[position] < 6) cardView.setCardBackgroundColor(Color.parseColor("#fff4ad87"));
        else if (exp[position] >= 6 && exp[position] < 8) cardView.setCardBackgroundColor(Color.parseColor("#fff1e9a5"));
        else cardView.setCardBackgroundColor(Color.parseColor("#FFD8F1AA"));

        return convertView;

    }
}
